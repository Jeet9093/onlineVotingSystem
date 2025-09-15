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
  TallyResult
} from '@/lib/voting-core';
import { verifyAdmin } from '@/ai/flows/verify-admin-flow';

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
  if (!name) {
    return { error: 'Voter name is required.' };
  }

  try {
    const result = await coreAddVoter(name);
    return {
      message: `Voter Added:\nName: ${result.name}\nID: ${result.voter_id}`
    };
  } catch (e) {
    return { error: (e as Error).message };
  }
}

export async function castVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const voterId = formData.get('voterId') as string;
  const electionId = formData.get('electionId') as string;
  const candidateId = formData.get('candidateId') as string;

  if (!voterId || !electionId || !candidateId) {
    return { error: 'Voter ID, Election ID, and Candidate ID are required.' };
  }

  try {
    const result = await coreCastVote(voterId, electionId, candidateId);
    revalidatePath('/');
    return {
      message: `Vote Recorded!\nBlock Index: #${result.block_index}\nVote Hash: ${result.vote_hash}\nBlock Hash: ${result.block_hash}`
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
