"use server";

import { revalidatePath } from 'next/cache';
import {
  createElection as coreCreateElection,
  addVoter as coreAddVoter,
  castVote as coreCastVote,
  closeElection as coreCloseElection,
  deleteElection as coreDeleteElection,
  tally as coreTally,
  verifyChain as coreVerifyChain,
  getAdminUser,
  getElectionCreatorPhoto,
  getAllVoters,
  getUser,
  updateUserPhoto as coreUpdateUserPhoto,
  TallyResult
} from '@/lib/voting-core';
import { verifyAdmin } from '@/ai/flows/verify-admin-flow';
import { identifyVoter } from '@/ai/flows/identify-voter-flow';

type FormState = {
  message?: string;
  error?: string;
  data?: any;
};

export async function createElection(prevState: FormState, formData: FormData): Promise<FormState> {
  const title = formData.get('title') as string;
  const candidatesStr = formData.get('candidates') as string;
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!title || !candidatesStr) {
    return { error: 'Title and candidates are required.' };
  }
  if (!photoDataUri) {
    return { error: 'Face verification is required.' };
  }

  const admin = await getAdminUser();
  const isFirstTime = admin.photoDataUri?.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

  try {
    if (!isFirstTime) {
        const verification = await verifyAdmin({
            referencePhotoDataUri: admin.photoDataUri!,
            livePhotoDataUri: photoDataUri,
        });
        if (!verification.isAuthorized) {
            return { error: `Face verification failed: ${verification.reason}` };
        }
    }
  } catch(e) {
    return { error: `Face verification failed: ${(e as Error).message}` };
  }

  const candidates = candidatesStr.split(',').map(s => s.trim()).filter(Boolean);
  if (candidates.length < 2) {
    return { error: 'Please provide at least two candidates.' };
  }

  try {
    // On first time, verification is implicitly passed and we update the photo.
    // On subsequent times, we update it to keep it fresh.
    await coreUpdateUserPhoto(admin.user_id, photoDataUri);
    
    // Pass the admin's ID to be stored with the election
    const result = await coreCreateElection(title, candidates, admin.user_id);
    revalidatePath('/');
    return {
      message: `Election Created:\nTitle: ${result.title}\nID: ${result.election_id}\n\nCandidates:\n${result.candidates.map(c => `- ${c.name}: ${c.id}`).join('\n')}`
    };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function addVoter(prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get('name') as string;
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!name) {
    return { error: 'Voter name is required.' };
  }
  if (!photoDataUri) {
    return { error: 'Voter photo is required.' };
  }

  try {
    const result = await coreAddVoter(name, photoDataUri);
    return {
      message: `Voter Added:\nName: ${result.name}\nID: ${result.voter_id}`
    };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function identifyVoterAndGetName(photoDataUri: string): Promise<{ error?: string; voterId?: string; voterName?: string; }> {
    if (!photoDataUri) {
        return { error: 'Photo data is missing.' };
    }
    try {
        const voters = await getAllVoters();
        const registeredVoters = voters.map(v => ({ user_id: v.user_id, photoDataUri: v.photoDataUri! })).filter(v => v.photoDataUri);

        if (registeredVoters.length === 0) {
            throw new Error("No voters with photos registered. Cannot perform face identification.");
        }
        
        const identification = await identifyVoter({
            livePhotoDataUri: photoDataUri,
            registeredVoters: registeredVoters,
        });

        if (!identification.matchFound || !identification.voterId) {
            throw new Error(`Could not identify voter: ${identification.reason}`);
        }
        
        const voter = await getUser(identification.voterId);
        if (!voter) {
            throw new Error("Identified voter not found in database.");
        }

        return { voterId: identification.voterId, voterName: voter.name };

    } catch(e) {
        return { error: (e as Error).message };
    }
}


export async function castVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const voterId = formData.get('voterId') as string;
  const electionId = formData.get('electionId') as string;
  const candidateId = formData.get('candidateId') as string;

  if (!voterId) {
    return { error: 'Voter ID is missing. Please identify yourself first.' };
  }
  if (!electionId || !candidateId) {
    return { error: 'Election ID and Candidate ID are required.' };
  }

  try {
    const result = await coreCastVote(voterId, electionId, candidateId);
    revalidatePath('/');
    return {
      message: `Vote Recorded!\nVoter ID: ${voterId}\nBlock Index: #${result.block_index}\nVote Hash: ${result.vote_hash}\nBlock Hash: ${result.block_hash}`
    };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function closeElection(prevState: FormState, formData: FormData): Promise<FormState> {
  const electionId = formData.get('electionId') as string;
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!electionId) {
    return { error: 'Election ID is required.' };
  }
  if (!photoDataUri) {
    return { error: 'Face verification is required.' };
  }
  
  try {
    const creatorInfo = await getElectionCreatorPhoto(electionId);
    if (!creatorInfo || !creatorInfo.photoDataUri) {
        return { error: 'Could not find the reference photo for the election creator.' };
    }

    const isFirstTime = creatorInfo.photoDataUri?.startsWith('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');

    if (!isFirstTime) {
      const verification = await verifyAdmin({
        referencePhotoDataUri: creatorInfo.photoDataUri,
        livePhotoDataUri: photoDataUri,
      });
      if (!verification.isAuthorized) {
          return { error: `Face verification failed: ${verification.reason}` };
      }
    }
    
    // Verification passed (or was skipped for a first-time user), let's update the creator's photo
    await coreUpdateUserPhoto(creatorInfo.creatorId, photoDataUri);
    const result = await coreCloseElection(electionId);
    revalidatePath('/');
    return { message: `Election ${result.election_id} has been closed.` };

  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function deleteElection(prevState: FormState, formData: FormData): Promise<FormState> {
  const electionId = formData.get('electionId') as string;
  const photoDataUri = formData.get('photoDataUri') as string;

  if (!electionId) {
    return { error: 'Election ID is required.' };
  }
  if (!photoDataUri) {
    return { error: 'Face verification is required.' };
  }
  
  try {
    const creatorInfo = await getElectionCreatorPhoto(electionId);
    if (!creatorInfo || !creatorInfo.photoDataUri) {
        return { error: 'Could not find the reference photo for the election creator.' };
    }

    const verification = await verifyAdmin({
      referencePhotoDataUri: creatorInfo.photoDataUri,
      livePhotoDataUri: photoDataUri,
    });
    if (!verification.isAuthorized) {
        return { error: `Face verification failed: ${verification.reason}` };
    }
    
    const result = await coreDeleteElection(electionId);
    revalidatePath('/');
    return { message: `Election ${result.election_id} has been deleted.` };

  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function tallyElection(prevState: FormState, formData: FormData): Promise<FormState & {data?: TallyResult}> {
  const electionId = formData.get('electionId') as string;
  if (!electionId) {
    return { error: 'Election ID is required.' };
  }

  try {
    const result = await coreTally(electionId);
    return { data: result };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function verifyChain(prevState: FormState, formData: FormData): Promise<FormState> {
    try {
        const result = await coreVerifyChain();
        if (result.ok) {
            return { message: result.message };
        } else {
            return { error: result.message };
        }
    } catch(e) {
        return { error: (e as Error).message };
    }
}
