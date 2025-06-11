'use client';

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/layout/header';
import { ChatView } from '@/components/chat/chat-view';
import { ChatInput } from '@/components/chat/chat-input';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Message } from '@/types';
import { handleUserMessage } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// It's better to install uuid and its types: npm install uuid @types/uuid
// For now, let's define a simple fallback if not available, but encourage installation.
const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Basic fallback for environments without crypto.randomUUID (like older Node versions in some setups)
  // or if uuidv4 is not resolving correctly without installation.
  // A proper UUID library is recommended for production.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


export default function HomePage() {
  const [messages, setMessages] = useLocalStorage<Message[]>('chatHistory', []);
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  const onSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseContent = await handleUserMessage(content, messages);
      const aiMessage: Message = {
        id: generateId(),
        role: 'model',
        content: aiResponseContent,
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI. Please check your API key and network.",
      });
      // Optionally, add an error message to the chat
      const errorMessage: Message = {
        id: generateId(),
        role: 'model',
        content: 'Sorry, I could not process your request. Please check your API key configuration in settings or try again later.',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if API key might be missing on initial load and prompt user.
  // This is a heuristic. A more robust check would involve an actual API test call.
  useEffect(() => {
    // Heuristic: if there are no messages and no API key example instruction previously dismissed.
    const apiKeyHintDismissed = localStorage.getItem('apiKeyHintDismissed');
    if (messages.length === 0 && !apiKeyHintDismissed) {
       // Check if GOOGLE_API_KEY seems to be set. This check is client-side and indicative.
       // Actual key usage is server-side.
       // This is tricky to check directly from client. This effect primarily serves as a reminder.
       // Let's open settings if it's the first time and no history.
       //setIsSettingsOpen(true);
       //localStorage.setItem('apiKeyHintDismissed', 'true'); // Avoid showing repeatedly
       
       // A less intrusive way: A small toast or a persistent banner if key seems missing.
       // For now, a console log reminder for the developer.
       console.info("Gemini Chat Local: Ensure your GOOGLE_API_KEY is set in .env.local. Open settings for instructions.");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-grow flex flex-col overflow-hidden">
        <ChatView messages={messages} isLoadingAiResponse={isLoading} />
      </main>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      <SettingsDialog isOpen={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
