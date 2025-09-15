"use server";

import { revalidatePath } from 'next/cache';
import {
  createElection as coreCreateElection,
  addVoter as coreAddVoter,
  castVote as coreCastVote,
  closeElection as coreCloseElection,
  tally as coreTally,
  verifyChain as coreVerifyChain,
  getAdminUser,
  getElectionCreatorPhoto,
  getAllVoters,
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
  if (!admin.photoDataUri) {
      return { error: 'Admin user does not have a reference photo. Cannot verify.' };
  }

  try {
    const verification = await verifyAdmin({
      referencePhotoDataUri: admin.photoDataUri,
      livePhotoDataUri: photoDataUri,
    });
    if (!verification.isAuthorized) {
        return { error: `Face verification failed: ${verification.reason}` };
    }
  } catch(e) {
    return { error: `Face verification failed: ${(e as Error).message}` };
  }


  const candidates = candidatesStr.split(',').map(s => s.trim()).filter(Boolean);
  if (candidates.length < 2) {
    return { error: 'Please provide at least two candidates.' };
  }

  try {
    const result = await coreCreateElection(title, candidates, admin.user_id, photoDataUri);
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

async function getVoterIdFromPhoto(photoDataUri: string): Promise<string> {
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

    return identification.voterId;
}


export async function castVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const photoDataUri = formData.get('photoDataUri') as string;
  const electionId = formData.get('electionId') as string;
  const candidateId = formData.get('candidateId') as string;

  if (!photoDataUri) {
    return { error: 'Face identification is required.' };
  }
  if (!electionId || !candidateId) {
    return { error: 'Election ID and Candidate ID are required.' };
  }
  
  let voterId: string;
  try {
      voterId = await getVoterIdFromPhoto(photoDataUri);
  } catch(e) {
      return { error: (e as Error).message };
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
  
  const referencePhotoDataUri = await getElectionCreatorPhoto(electionId);
  if (!referencePhotoDataUri) {
      return { error: 'Could not find the reference photo for the election creator.' };
  }

  try {
    const verification = await verifyAdmin({
      referencePhotoDataUri,
      livePhotoDataUri: photoDataUri,
    });
    if (!verification.isAuthorized) {
        return { error: `Face verification failed: ${verification.reason}` };
    }
  } catch(e) {
    return { error: `Face verification failed: ${(e as Error).message}` };
  }


  try {
    const result = await coreCloseElection(electionId);
    revalidatePath('/');
    return { message: `Election ${result.election_id} has been closed.` };
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
