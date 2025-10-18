import { tool } from "ai";
import { z } from "zod";

export const createItinerary = tool({
  description: "Create a travel itinerary based on a location and interests.",
  inputSchema: z.object({
    location: z.string().describe("The city or location for the itinerary."),
    interests: z
      .array(z.string())
      .describe("A list of interests to base the itinerary on."),
  }),
  execute: async ({ location, interests }) => {
    // In a real-world scenario, this could call another API
    // or use a more complex logic to generate an itinerary.
    const itinerary = `Here is a sample itinerary for ${location} based on your interests in ${interests.join(
      ", "
    )}:
- Morning: Visit a local museum.
- Afternoon: Explore a famous park.
- Evening: Enjoy dinner at a highly-rated restaurant.`;

    return {
      itinerary,
    };
  },
});
