import { tool } from 'ai';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';
import { Storybook, type StorybookData } from '@/components/storybook';
import { fetchStoryTool } from './fetch-story';
import { createStorybookTool } from './create-storybook';
import { getStockPrice } from './get-stock-price';

export const generateAndDisplayStorybookTool = tool({
  description: 'Generate and display a storybook from a query.',
  parameters: z.object({
    query: z.string().describe('The query to generate the storybook for.'),
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
  }),
  generate: async function* ({ query, num_pages, style }) {
    const stream = createStreamableValue();

    (async () => {
      // Chain 1: Fetch the story
      const { story, error: fetchError } = await fetchStoryTool.execute({
        query,
      });

      if (fetchError) {
        stream.done({
          status: 'error',
          error: fetchError,
        });
        return;
      }

      // Chain 2: Create the storybook
      const storybookData: StorybookData & { error?: string } =
        await createStorybookTool.execute({
          theme: story,
          num_pages,
          style,
        });

      if (storybookData.error) {
        stream.done({
          status: 'error',
          error: storybookData.error,
        });
        return;
      }

      // Display the component
      stream.done({
        status: 'success',
        component: Storybook,
        props: {
          storybook: storybookData,
        },
      });
    })();

    return {
      status: 'pending',
      component: Storybook,
      props: {
        storybook: {
          title: `Generating storybook for "${query}"...`,
          author: 'AI',
          description: '',
          pages: [],
          spreads: [],
          cover_url: '',
          storybook_id: '',
        },
      },
    };
  },
});
