'use server';
/**
 * @fileOverview An AI flow to verify an administrator's identity via a photo.
 *
 * - verifyAdmin - A function that handles the admin face verification process.
 * - VerifyAdminInput - The input type for the verifyAdmin function.
 * - VerifyAdminOutput - The return type for the verifyAdmin function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getAdminUser, type User } from '@/lib/voting-core';

const VerifyAdminInputSchema = z.object({
  referencePhotoDataUri: z
    .string()
    .describe(
      "A reference photo of the authorized person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  livePhotoDataUri: z
    .string()
    .describe(
      "A live photo of the person to verify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyAdminInput = z.infer<typeof VerifyAdminInputSchema>;

const VerifyAdminOutputSchema = z.object({
  isAuthorized: z.boolean().describe('Whether the person in the live photo is the same as the person in the reference photo.'),
  reason: z.string().describe('The reason for the authorization decision.'),
});
export type VerifyAdminOutput = z.infer<typeof VerifyAdminOutputSchema>;


export async function verifyAdmin(input: VerifyAdminInput): Promise<VerifyAdminOutput> {
  return verifyAdminFlow(input);
}

const verifyAdminFlow = ai.defineFlow(
  {
    name: 'verifyAdminFlow',
    inputSchema: VerifyAdminInputSchema,
    outputSchema: VerifyAdminOutputSchema,
  },
  async (input) => {
    
    const prompt = ai.definePrompt({
        name: 'verifyAdminPrompt',
        input: { schema: VerifyAdminInputSchema },
        output: { schema: VerifyAdminOutputSchema },
        prompt: `You are a security expert responsible for verifying user identities by comparing two photos.
    
        Your task is to determine if the person in the live photo is the same as the person in the reference photo.
    
        - First, confirm both images contain a clear, live photo of a single adult human face. Reject any images that are drawings, avatars, contain multiple people, no people, or are not live photos (e.g., a photo of a photo).
        - Second, if both images are valid, perform a face match comparison.
    
        Return your decision in the specified JSON format. If you reject the images or if they don't match, provide a clear reason.
    
        Reference Photo:
        {{media url=referencePhotoDataUri}}

        Live Photo to verify:
        {{media url=livePhotoDataUri}}`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
