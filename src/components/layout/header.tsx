'use client';

import { Button } from '@/components/ui/button';
import { Settings, MessageSquareText } from 'lucide-react';

interface AppHeaderProps {
  onSettingsClick: () => void;
}

export function AppHeader({ onSettingsClick }: AppHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <MessageSquareText className="h-7 w-7 mr-2" />
        <h1 className="text-xl font-semibold font-headline">Gemini Chat Local</h1>
      </div>
      <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Settings">
        <Settings className="h-5 w-5 text-primary-foreground" />
      </Button>
    </header>
  );
}
