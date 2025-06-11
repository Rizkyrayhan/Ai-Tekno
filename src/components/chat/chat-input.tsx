'use client';

import { useState, type FormEvent } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizonal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky bottom-0 bg-background border-t p-4 flex items-center gap-2 shadow- ऊपर"
    >
      <Textarea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-grow resize-none focus:ring-accent"
        rows={1}
        disabled={isLoading}
        aria-label="Chat message input"
      />
      <Button type="submit" disabled={isLoading || !inputValue.trim()} size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground" aria-label="Send message">
        <SendHorizonal className="h-5 w-5" />
      </Button>
    </form>
  );
}
