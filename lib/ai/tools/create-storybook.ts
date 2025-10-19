import { tool } from 'ai';
import { z } from 'zod';

export const createStorybookTool = tool({
  description: 'Create a storybook with images and text from a theme.',
  parameters: z.object({
    theme: z
      .string()
      .describe('The theme or story to generate the storybook from.'),
    num_pages: z
      .number()
      .optional()
      .default(5)
      .describe('The number of pages for the storybook.'),
    style: z
      .string()
      .optional()
      .default('claymotion')
      .describe('The artistic style of the storybook images.'),
    reference_image: z
      .string()
      .optional()
      .describe('A reference image URL for the style.'),
  }),
  execute: async ({ theme, num_pages, style, reference_image }) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/stories/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          theme,
          num_pages,
          style,
          reference_image,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to create storybook:', error);
      return { error: 'Failed to create storybook.' };
    }
  },
});
