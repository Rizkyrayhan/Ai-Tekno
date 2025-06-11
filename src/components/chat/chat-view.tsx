'use client';

import type { Message } from '@/types';
import { ChatMessage } from './chat-message';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

interface ChatViewProps {
  messages: Message[];
  isLoadingAiResponse: boolean;
}

export function ChatView({ messages, isLoadingAiResponse }: ChatViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoadingAiResponse]);

  return (
    <ScrollArea className="flex-grow p-4" viewportRef={viewportRef} ref={scrollAreaRef}>
      <div className="max-w-3xl mx-auto space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoadingAiResponse && (
          <div className="flex items-center gap-2 p-4 my-2 rounded-lg shadow-sm bg-card text-card-foreground border w-fit max-w-[80%] mr-auto">
            <Bot className="h-5 w-5 animate-pulse text-muted-foreground" />
            <p className="text-sm text-muted-foreground">AI is typing...</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
