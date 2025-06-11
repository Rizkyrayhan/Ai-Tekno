'use server';

/**
 * @fileOverview Generates a title for a chat based on the first few messages.
 *
 * - generateTitle - A function that generates a title for a chat.
 * - GenerateTitleInput - The input type for the generateTitle function.
 * - GenerateTitleOutput - The return type for the generateTitle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTitleInputSchema = z.object({
  messages: z
    .array(z.string())
    .describe('The first few messages of the chat to generate a title from.'),
});
export type GenerateTitleInput = z.infer<typeof GenerateTitleInputSchema>;

const GenerateTitleOutputSchema = z.object({
  title: z.string().describe('The generated title for the chat.'),
});
export type GenerateTitleOutput = z.infer<typeof GenerateTitleOutputSchema>;

export async function generateTitle(input: GenerateTitleInput): Promise<GenerateTitleOutput> {
  return generateTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTitlePrompt',
  input: {schema: GenerateTitleInputSchema},
  output: {schema: GenerateTitleOutputSchema},
  prompt: `You are an AI that generates concise titles for chats based on the first few messages.

  Messages:
  {{#each messages}}
  - {{{this}}}
  {{/each}}

  Generate a title that accurately reflects the content of the chat.
  The title should be no more than 5 words.
  `,
});

const generateTitleFlow = ai.defineFlow(
  {
    name: 'generateTitleFlow',
    inputSchema: GenerateTitleInputSchema,
    outputSchema: GenerateTitleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
