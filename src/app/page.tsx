
'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppHeader } from '@/components/layout/header';
import { ChatView } from '@/components/chat/chat-view';
import { ChatInput } from '@/components/chat/chat-input';
import useLocalStorage from '@/hooks/use-local-storage';
import type { Message } from '@/types';
import { handleUserMessage } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { Skeleton } from "@/components/ui/skeleton";

const EMPTY_MESSAGES: Message[] = [];

export default function HomePage() {
  const [messages, setMessages] = useLocalStorage<Message[]>('chatHistory', EMPTY_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const onSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const aiResponseContent = await handleUserMessage(content, messages);
      const aiMessage: Message = {
        id: uuidv4(),
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
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'model',
        content: 'Sorry, I could not process your request. Please check your API key configuration or try again later.',
        timestamp: new Date(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = useCallback(() => {
    setMessages(EMPTY_MESSAGES);
    toast({
      title: "Chat Cleared",
      description: "Your chat history has been cleared.",
    });
  }, [setMessages, toast]);

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader 
        onClearChat={clearChat} 
      />
      <main className="flex-grow flex flex-col overflow-hidden">
        {hasHydrated ? (
          <ChatView messages={messages} isLoadingAiResponse={isLoading} />
        ) : (
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="space-y-4 w-full max-w-3xl">
              <Skeleton className="h-20 w-3/4 rounded-lg" />
              <Skeleton className="h-20 w-3/4 rounded-lg ml-auto" />
              <Skeleton className="h-20 w-3/4 rounded-lg" />
              <p className="text-center text-muted-foreground">Loading messages...</p>
            </div>
          </div>
        )}
      </main>
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading || !hasHydrated} />
    </div>
  );
}
