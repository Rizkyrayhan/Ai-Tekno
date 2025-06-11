
'use client';

import { Button } from '@/components/ui/button';
import { Settings, MessageSquareText, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AppHeaderProps {
  onSettingsClick: () => void;
  onClearChat: () => void;
}

export function AppHeader({ onSettingsClick, onClearChat }: AppHeaderProps) {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <MessageSquareText className="h-7 w-7 mr-2" />
        <h1 className="text-xl font-semibold font-headline">Chat with Mbah Tekno</h1>
      </div>
      <div className="flex items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Clear chat history">
              <Trash2 className="h-5 w-5 text-primary-foreground" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete your current chat history. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onClearChat} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Clear Chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button variant="ghost" size="icon" onClick={onSettingsClick} aria-label="Settings">
          <Settings className="h-5 w-5 text-primary-foreground" />
        </Button>
      </div>
    </header>
  );
}
