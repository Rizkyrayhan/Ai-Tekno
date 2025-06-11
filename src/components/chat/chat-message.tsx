'use client';

import type { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Bot } from 'lucide-react';
import { format } from 'date-fns';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 my-2 rounded-lg shadow-sm w-fit max-w-[80%]',
        isUser ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-card text-card-foreground border'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {/* Placeholder for actual images if available */}
        {/* <AvatarImage src={isUser ? "/user-avatar.png" : "/ai-avatar.png"} /> */}
        <AvatarFallback className={cn(isUser ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground')}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <span className={cn("text-xs mt-1", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
          {format(new Date(message.timestamp), 'p')}
        </span>
      </div>
    </div>
  );
}
