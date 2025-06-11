'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateSystemInstruction, generateToolRequest} from 'genkit/tools';

const ChatHistoryItemSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatWithAIInputSchema = z.object({
  message: z.string().describe('The current user message.'),
  history: z.array(ChatHistoryItemSchema).describe('The chat history.'),
});
export type ChatWithAIInput = z.infer<typeof ChatWithAIInputSchema>;

const ChatWithAIOutputSchema = z.object({
  response: z.string().describe('The AI-generated response.'),
});
export type ChatWithAIOutput = z.infer<typeof ChatWithAIOutputSchema>;

export async function chatWithAI(input: ChatWithAIInput): Promise<ChatWithAIOutput> {
  return chatWithAIFlow(input);
}

const chatWithAIFlow = ai.defineFlow(
  {
    name: 'chatWithAIFlow',
    inputSchema: ChatWithAIInputSchema,
    outputSchema: ChatWithAIOutputSchema,
  },
  async (input) => {
    const formattedHistory = input.history.map((item) => ({
      role: item.role,
      content: [{text: item.content}],
    }));

    const response = await ai.generate({
      prompt: [{text: input.message}],
      history: formattedHistory,
      model: 'googleai/gemini-2.0-flash', // Using the model specified in genkit.ts
      config: {
        temperature: 0.7, // Adjust creativity
      },
    });
    
    const textResponse = response.text();
    if (!textResponse) {
      throw new Error("No text response from AI.");
    }
    return { response: textResponse };
  }
);
