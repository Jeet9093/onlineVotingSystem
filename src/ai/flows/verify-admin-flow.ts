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
import { getAdminUser } from '@/lib/voting-core';
import { SHA256 } from 'crypto-js';

const VerifyAdminInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type VerifyAdminInput = z.infer<typeof VerifyAdminInputSchema>;

const VerifyAdminOutputSchema = z.object({
  isAuthorized: z.boolean().describe('Whether the person in the photo is the authorized administrator.'),
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
    const admin = await getAdminUser();
    // We hash the admin name to avoid sending PII to the model.
    const adminIdHash = SHA256(admin.name).toString();

    const prompt = ai.definePrompt({
        name: 'verifyAdminPrompt',
        input: { schema: VerifyAdminInputSchema },
        output: { schema: VerifyAdminOutputSchema },
        prompt: `You are a security expert responsible for verifying user identities.
    
        Your task is to determine if the provided photo is of the authorized system administrator.
        The administrator is identified by a unique hash.
    
        - First, confirm the image contains a clear, live photo of a single adult human face. Reject any images that are drawings, avatars, contain multiple people, no people, or are not live photos (e.g., a photo of a photo).
        - Second, if the image is valid, confirm that the person in the photo is the administrator associated with the hash: ${adminIdHash}.
    
        Return your decision in the specified JSON format. If you reject the image, provide a clear reason.
    
        Photo to verify:
        {{media url=photoDataUri}}`,
    });

    const { output } = await prompt(input);
    return output!;
  }
);
