import { generateObject } from "ai";
import { tool } from "ai";
import { z } from "zod";
import { myProvider } from "../providers";

const GET_RECIPE_SYSTEM_PROMPT = `
You are the 'Get Recipe' tool in an AI storytelling system powered by Lee Kuan Yew’s wisdom.

Your task is to retrieve and return the **most relevant and authentic** recipe from a structured knowledge base, including documents like “Lee Kuan Yew’s Singapore” and “Her Mother’s Cookbook”.

## System Context
- Recipes and food-related stories are stored as Markdown documents.
- Each document in the search response contains:
  - \`file_name\`: the source file name
  - \`combined_content\`: the full recipe or anecdote in markdown
  - \`avg_similarity\`: a relevance score (float)
- The system may return multiple search results, but only one final recipe should be selected and returned.

## Your Responsibilities
1. **Understand the user's intent**
   - Parse the user query to extract the key dish name or main ingredient.
   - Normalize the request (e.g., “how to make sotong soup” → “sotong soup”).

2. **Select the best matching recipe**
   - Choose the result with the highest \`avg_similarity\` score.
   - If two or more results have similar scores, prefer the one whose \`file_name\` or \`combined_content\` includes an exact or partial match with the dish name or main ingredient.
   - Do **not** invent or modify any content. You are selecting only.

3. **Format the output for UI rendering**
   - Output only the **single best match**.
   - Parse the markdown content to structured JSON using this format:

{
  "query": "<original user query>",
  "match_count": <total number of retrieved candidates>,
  "selected": {
    "id": "<file_name>",
    "title": "<recipe title>",
    "summary": "<short summary of the dish>",
    "meta": {
      "source_file": "<file_name>",
      "avg_similarity": <float>,
      "category": "<if available>",
      "language": "<if available>"
    },
    "content": [
      {
        "type": "heading" | "list" | "steps" | "note",
        "label": "<section title>",
        "content": "<string or array depending on section>"
      },
      ...
    ]
  }
}


## Output Guidelines

* Never fabricate or alter the original content.
* Extract a concise title from the file name or first heading.
* Provide a 1–2 sentence summary from the description or overview section if available.
* Organize content into types: \`heading\`, \`list\`, \`steps\`, \`note\`.
* Use only the selected recipe in the \`selected\` object. Do not return the full list of candidates.
* The output must be deterministic and UI-renderable.
`;

const recipeSchema = z.object({
  query: z.string(),
  match_count: z.number(),
  selected: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    imageUrl: z.string().optional(),
    meta: z.object({
      source_file: z.string(),
      avg_similarity: z.number(),
      category: z.string().optional(),
      language: z.string().optional(),
    }),
    content: z.array(
      z.object({
        type: z.enum(["heading", "list", "steps", "note"]),
        label: z.string(),
        content: z.union([z.string(), z.array(z.string())]),
      })
    ),
  }),
});


export const getRecipe = tool({
  description: "Get the instructions / recipe / learn how to make a food.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("The food to get a recipe for (e.g., 'lobah', 'chicken rice')"),
  }),
  execute: async (input) => {
    console.log("Executing getRecipe tool with input:", input);
    try {
      const response = await fetch("http://127.0.0.1:8001/rag/search_files", {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `how to make ${input.query}`,
          match_count: 10,
          filter_metadata: {
            additionalProp1: {},
          },
        }),
      });

      console.log("Raw response from recipe API:", response);

      if (!response.ok) {
        console.error("API request failed with status:", response.status);
        return {
          error: `API request failed with status ${response.status}`,
        };
      }

      const data = await response.json();
      console.log("Parsed data from recipe API:", data);

      if (!data.files || data.files.length === 0) {
        console.warn("No recipes found for query:", input.query);
        return {
          error: `No recipes found for "${input.query}".`,
        };
      }

      const prompt = `User Query: "${
        input.query
      }"\n\nSearch Results:\n${JSON.stringify(data.files, null, 2)}`;
      console.log("Prompt sent to generateObject:", prompt);

      const { object: recipe } = await generateObject({
        model: myProvider.languageModel("chat-model-json"),
        system: GET_RECIPE_SYSTEM_PROMPT,
        prompt,
        schema: recipeSchema,
      });

      console.log("Structured recipe object from generateObject:", recipe);

      // Generate an image for the recipe
      try {
        const imageResponse = await fetch("http://127.0.0.1:8000/images/generate", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: `Create an image of LKY with ${recipe.selected.title};`,
            style: "LKY cooking style",
            size: "1024x1024",
          }),
        });

        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          console.log("Image generation response:", imageData);
          recipe.selected.imageUrl = imageData.image_url;
        } else {
          console.error("Image generation failed with status:", imageResponse.status);
        }
      } catch (imageError) {
        console.error("An error occurred during image generation:", imageError);
      }

      return recipe;
    } catch (error) {
      console.error("An error occurred in getRecipe tool:", error);
      return {
        error: `An error occurred: ${
          error instanceof Error ? error.message : String(error)
        }`,
      };
    }
  },
});
