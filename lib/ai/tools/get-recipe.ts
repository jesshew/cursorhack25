import { tool } from "ai";
import { z } from "zod";

export const getRecipe = tool({
  description: "Get a recipe for a food.",
  inputSchema: z.object({
    query: z.string().describe("The food to get a recipe for (e.g., 'lobah', 'chicken rice')"),
  }),
  execute: async (input) => {
    try {
      const response = await fetch(
        'http://127.0.0.1:8000/rag/search_files',
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `how to make ${input.query}`,
            match_count: 10,
            filter_metadata: {
              "additionalProp1": {}
            }
          })
        }
      );

      if (!response.ok) {
        return {
          error: `API request failed with status ${response.status}`,
        };
      }

      const data = await response.json();

      if (!data.files || data.files.length === 0) {
        return {
          error: `No recipes found for "${input.query}".`,
        };
      }

      const bestMatch = data.files.reduce((prev: any, current: any) => {
        return (prev.avg_similarity > current.avg_similarity) ? prev : current
      });

      return {
        recipe: bestMatch.combined_content,
      };
    } catch (error) {
      return {
        error: `An error occurred: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  },
});
