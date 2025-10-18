import type { InferUITool, UIMessage } from "ai";
import { z } from "zod";
import type { ArtifactKind } from "@/components/artifact";
import type { createDocument } from "./ai/tools/create-document";
import type { getWeather } from "./ai/tools/get-weather";
import type { getRecipe } from "./ai/tools/get-recipe";
import type { requestSuggestions } from "./ai/tools/request-suggestions";
import type { updateDocument } from "./ai/tools/update-document";
import type { createItinerary } from "./ai/tools/create-itinerary";
import type { Suggestion } from "./db/schema";
import type { AppUsage } from "./usage";
import type { User as NextAuthUser } from "next-auth";
import type { Message } from "ai";

export type DataPart = { type: "append-message"; message: string };

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

type weatherTool = InferUITool<typeof getWeather>;
type suggestionsTool = InferUITool<typeof requestSuggestions>;
type createDocumentTool = InferUITool<typeof createDocument>;
type updateDocumentTool = InferUITool<typeof updateDocument>;
type createItineraryTool = InferUITool<typeof createItinerary>;
type recipeTool = InferUITool<typeof getRecipe>;

export type ToolTypes = {
  getWeather: weatherTool;
  requestSuggestions: suggestionsTool;
  createDocument: createDocumentTool;
  updateDocument: updateDocumentTool;
  createItinerary: createItineraryTool;
  getRecipe: recipeTool;
};

export type ArtifactTool =
  | "getWeather"
  | "createDocument"
  | "updateDocument"
  | "requestSuggestions"
  | "createItinerary";

export type CustomUIDataTypes = {
  textDelta: string;
  imageDelta: string;
  sheetDelta: string;
  codeDelta: string;
  suggestion: Suggestion;
  appendMessage: string;
  id: string;
  title: string;
  kind: ArtifactKind;
  clear: null;
  finish: null;
  usage: AppUsage;
};

export type ChatMessage = UIMessage<
  MessageMetadata,
  CustomUIDataTypes,
  ToolTypes
>;

export type Attachment = {
  name: string;
  url: string;
  contentType: string;
};

export type AppUser = NextAuthUser & {
  id: string;
};
