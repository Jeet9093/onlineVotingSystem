'use server';
/**
 * @fileOverview An AI flow to identify a voter from a live photo.
 *
 * - identifyVoter - A function that handles the voter face identification process.
 * - IdentifyVoterInput - The input type for the identifyVoter function.
 * - IdentifyVoterOutput - The return type for the identifyVoter function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const VoterInfoSchema = z.object({
  user_id: z.string(),
  photoDataUri: z.string(),
});

const IdentifyVoterInputSchema = z.object({
  livePhotoDataUri: z
    .string()
    .describe(
      "A live photo of the person to identify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  registeredVoters: z.array(VoterInfoSchema).describe("A list of all registered voters with their photos."),
});
export type IdentifyVoterInput = z.infer<typeof IdentifyVoterInputSchema>;

const IdentifyVoterOutputSchema = z.object({
  matchFound: z.boolean().describe('Whether a matching voter was found.'),
  voterId: z.string().optional().describe('The user_id of the matched voter, if any.'),
  reason: z.string().describe('The reason for the decision.'),
});
export type IdentifyVoterOutput = z.infer<typeof IdentifyVoterOutputSchema>;


export async function identifyVoter(input: IdentifyVoterInput): Promise<IdentifyVoterOutput> {
  return identifyVoterFlow(input);
}

const identifyVoterFlow = ai.defineFlow(
  {
    name: 'identifyVoterFlow',
    inputSchema: IdentifyVoterInputSchema,
    outputSchema: IdentifyVoterOutputSchema,
  },
  async ({ livePhotoDataUri, registeredVoters }) => {
    
    // This is a simplified approach for a demo.
    // In a real-world scenario, you'd use a more sophisticated face recognition service
    // that can efficiently search a large database of faces.
    // Here, we'll construct a prompt that asks the model to find the best match.

    const prompt = ai.definePrompt({
        name: 'identifyVoterPrompt',
        output: { schema: IdentifyVoterOutputSchema },
        prompt: `You are a highly accurate AI-powered voter identification system. Your task is to find a match for a person in a live photo from a list of registered voters' photos.

        Live Photo to Identify:
        {{media url=livePhotoDataUri}}

        Registered Voters:
        {{#each voters}}
        - Voter ID: {{this.user_id}}
          Photo: {{media url=this.photoDataUri}}
        {{/each}}

        Instructions:
        1.  Carefully examine the live photo. Ensure it contains a clear, single human face. If not, state that the live photo is invalid.
        2.  Compare the face in the live photo against the photo of each registered voter.
        3.  If you find a confident match, return the 'user_id' of that voter. The match must be very high confidence.
        4.  If no confident match is found after checking all registered voters, indicate that no match was found.
        5.  Provide your decision in the specified JSON format.`,
    });

    const { output } = await prompt({
        livePhotoDataUri,
        voters: registeredVoters,
    });
    return output!;
  }
);
