
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
      model: 'googleai/gemini-2.0-flash', 
      config: {
        temperature: 0.7, 
      },
    });
    
    const textResponse = response.text;
    if (textResponse) {
      return { response: textResponse };
    }

    // If no text response, investigate further to provide a more specific error.
    let detailedError = "AI returned an empty or malformed response."; 

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason) {
        // Only provide detailed reason if it's not a normal stop or unknown (which might still be normal if text is missing for other reasons)
        if (candidate.finishReason !== 'STOP' && candidate.finishReason !== 'UNKNOWN') {
          detailedError = `AI response generation finished with reason: ${candidate.finishReason}.`;
          if (candidate.finishMessage) {
            detailedError += ` Details: ${candidate.finishMessage}.`;
          }
        } else if (candidate.finishReason === 'STOP' && !textResponse) {
            detailedError = "AI response generation stopped normally but no text content was found.";
        }
      }
    } else if (!response.candidates || response.candidates.length === 0) {
      detailedError = "AI response contained no candidates.";
    }
    
    // Log the full Genkit response on the server for easier debugging.
    console.error("Genkit full response details:", JSON.stringify(response, null, 2));
    throw new Error(detailedError);
  }
);
