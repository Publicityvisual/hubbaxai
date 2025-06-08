import { tool } from 'ai';
import { z } from 'zod';

export const generateSlogan = tool({
  description: 'Generate a creative marketing slogan using NovaAI',
  parameters: z.object({
    prompt: z.string(),
  }),
  execute: async ({ prompt }) => {
    const apiUrl = process.env.NOVA_AI_API_URL;
    const apiKey = process.env.NOVA_AI_API_KEY;

    if (!apiUrl || !apiKey) {
      throw new Error('NovaAI is not configured');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data;
  },
});
