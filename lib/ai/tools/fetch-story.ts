import { tool } from 'ai';
import { z } from 'zod';

export const fetchStoryTool = tool({
  description: 'Fetch a story based on a query.',
  parameters: z.object({
    query: z.string().describe('The query to fetch the story for.'),
  }),
  execute: async ({ query }) => {
    try {
      const response = await fetch('http://127.0.0.1:8001/stories/get_stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { story: data.story };
    } catch (error) {
      console.error('Failed to fetch story:', error);
      return { error: 'Failed to fetch story.' };
    }
  },
});
