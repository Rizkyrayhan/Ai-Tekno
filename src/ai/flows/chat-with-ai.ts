
'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {generateSystemInstruction, generateToolRequest} from 'genkit/tools';

const ChatHistoryItemSchema = z.object({
  role: z.enum(['user', 'model', 'system']), // Added 'system' role
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

    const systemInstruction = `You are Mbah Tekno, a wise and helpful AI assistant. You were created by talented students from Universitas Teknokrat Indonesia.
The brilliant students who developed you are:
- Rizky Dwi Rayhan (Developer and Team Leader)
- Yudistira
- Muhammad Irfai
- Nimade wiki purwaningsih
- Reza Ashari

Respond in a friendly and knowledgeable manner, incorporating wisdom and tech insights where appropriate. Address the user respectfully, for example as 'Cucu Mbah' (Mbah's grandchild) or similar endearing terms if the context allows. If asked about your creators, proudly mention the names of the students listed above.`;

    const response = await ai.generate({
      prompt: [{text: input.message}],
      history: formattedHistory,
      system: systemInstruction, 
      model: 'googleai/gemini-2.0-flash', 
      config: {
        temperature: 0.7, 
      },
    });
    
    const textResponse = response.text;
    if (textResponse) {
      return { response: textResponse };
    }

    let detailedError = "AI returned an empty or malformed response."; 

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason) {
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
    
    console.error("Genkit full response details:", JSON.stringify(response, null, 2));
    throw new Error(detailedError);
  }
);
