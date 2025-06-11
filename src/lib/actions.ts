'use server';

import { chatWithAI, type ChatWithAIInput } from '@/ai/flows/chat-with-ai';
import type { Message } from '@/types';

export async function handleUserMessage(
  currentMessage: string,
  history: Message[]
): Promise<string> {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      content: msg.content,
    }));

    const input: ChatWithAIInput = {
      message: currentMessage,
      history: formattedHistory,
    };
    
    const output = await chatWithAI(input);
    return output.response;
  } catch (error) {
    console.error('Error calling AI:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
}
