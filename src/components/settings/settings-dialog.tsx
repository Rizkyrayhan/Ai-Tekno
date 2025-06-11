'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Code className="mr-2 h-5 w-5" /> API Key Configuration
          </DialogTitle>
          <DialogDescription>
            To use Gemini Chat Local, you need to configure your Google Gemini API key.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-foreground">
            1. Create a file named <code className="font-mono bg-muted px-1 py-0.5 rounded">.env.local</code> in the root of your project directory (next to <code className="font-mono bg-muted px-1 py-0.5 rounded">package.json</code>).
          </p>
          <p className="text-sm text-foreground">
            2. Add the following line to the <code className="font-mono bg-muted px-1 py-0.5 rounded">.env.local</code> file, replacing <code className="font-mono bg-muted px-1 py-0.5 rounded">YOUR_API_KEY</code> with your actual Gemini API key:
          </p>
          <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
            <code className="font-mono text-foreground">GOOGLE_API_KEY=YOUR_API_KEY</code>
          </pre>
          <p className="text-sm text-foreground">
            3. Save the file and restart your development server (e.g., <code className="font-mono bg-muted px-1 py-0.5 rounded">npm run dev</code>) for the changes to take effect.
          </p>
          <p className="text-sm text-muted-foreground">
            Your API key is used locally and is not shared.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
