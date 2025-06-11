
'use client';

import { Button } from '@/components/ui/button';
import { MessageSquareText, Trash2, Settings, Sun, Moon } from 'lucide-react';
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
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from 'react';

interface AppHeaderProps {
  onClearChat: () => void;
}

export function AppHeader({ onClearChat }: AppHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center">
          <MessageSquareText className="h-7 w-7 mr-2" />
          <h1 className="text-xl font-semibold font-headline">Chat with Mbah Tekno</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8"></div> {/* Placeholder for settings icon to prevent layout shift */}
          <div className="h-8 w-8"></div> {/* Placeholder for trash icon to prevent layout shift */}
        </div>
      </header>
    );
  }

  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center">
        <MessageSquareText className="h-7 w-7 mr-2" />
        <h1 className="text-xl font-semibold font-headline">Chat with Mbah Tekno</h1>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Settings">
              <Settings className="h-5 w-5 text-primary-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="focus:bg-transparent">
              <div className="flex items-center justify-between w-full">
                <Label htmlFor="dark-mode-toggle" className="flex items-center gap-2 cursor-pointer">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Dark Mode
                </Label>
                <Switch
                  id="dark-mode-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
      </div>
    </header>
  );
}
