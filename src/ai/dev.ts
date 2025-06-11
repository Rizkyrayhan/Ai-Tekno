
import dotenv from 'dotenv';
import path from 'path';

// Explicitly load .env.local from the project root
const projectRoot = process.cwd();
const envPath = path.resolve(projectRoot, '.env.local');

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.warn(`Warning: Could not load .env.local file from ${envPath}. Error: ${result.error.message}`);
  console.warn('Genkit might not find the GOOGLE_API_KEY. Ensure .env.local exists in the project root or the key is set globally.');
} else {
  // Optional: You can uncomment this for debugging locally, but REMOVE before committing/sharing.
  // console.log(`.env.local loaded successfully from ${envPath}`);
  // console.log('GOOGLE_API_KEY is set:', !!process.env.GOOGLE_API_KEY);
}


import '@/ai/flows/generate-title.ts';
import '@/ai/flows/summarize-chat.ts';
import '@/ai/flows/chat-with-ai.ts';
