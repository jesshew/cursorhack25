import { tool } from "ai";
import { z } from "zod";

export const getStorybook = tool({
  description: "Show the storybook 'The Gardener of the Garden City'",
  inputSchema: z.object({}),
  execute: async () => {
    return {
      success: true,
      title: "The Gardener of the Garden City",
    };
  },
});
