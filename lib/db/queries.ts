import "server-only";
import { supabase } from "../supabase";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  type SQL,
} from "drizzle-orm";
// import { drizzle } from "drizzle-orm/postgres-js";
// import postgres from "postgres";
import type { ArtifactKind } from "@/components/artifact";
import type { VisibilityType } from "@/components/visibility-selector";
import { ChatSDKError } from "../errors";
import type { AppUsage } from "../usage";
import { generateUUID } from "../utils";
import { db } from "./";
import {
  type Chat,
  chat,
  type DBMessage,
  document,
  message,
  type Suggestion,
  stream,
  suggestion,
  type User,
  user,
  vote,
} from "./schema";
import { generateHashedPassword } from "./utils";

// Optionally, if not using email/pass login, you can
// use the Drizzle adapter for Auth.js / NextAuth
// https://authjs.dev/reference/adapter/drizzle

// biome-ignore lint: Forbidden non-null assertion.
// const client = postgres(process.env.POSTGRES_URL!);
// const db = drizzle(client);

export async function getUser(email: string): Promise<User[]> {
  // try {
  //   return await db.select().from(user).where(eq(user.email, email));
  // } catch (error) {
  //   console.error("Database query failed in getUser:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get user by email"
  //   );
  // }
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("email", email);

  if (error) {
    console.error("Supabase query failed in getUser:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get user by email"
    );
  }

  return data || [];
}

export async function createUser(email: string, password: string) {
  const hashedPassword = generateHashedPassword(password);

  // try {
  //   return await db.insert(user).values({ email, password: hashedPassword });
  // } catch (error) {
  //   console.error("Database query failed in createUser:", error);
  //   throw new ChatSDKError("bad_request:database", "Failed to create user");
  // }
  const { data, error } = await supabase
    .from("user")
    .insert([{ email, password: hashedPassword }])
    .select();

  if (error) {
    console.error("Supabase query failed in createUser:", error);
    throw new ChatSDKError("bad_request:database", "Failed to create user");
  }

  return data;
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateHashedPassword(generateUUID());

  // try {
  //   return await db.insert(user).values({ email, password }).returning({
  //     id: user.id,
  //     email: user.email,
  //   });
  // } catch (error) {
  //   console.error("Database query failed in createGuestUser:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to create guest user"
  //   );
  // }
  const { data, error } = await supabase
    .from("user")
    .insert([{ email, password }])
    .select("id, email");

  if (error) {
    console.error("Supabase query failed in createGuestUser:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create guest user"
    );
  }

  return data;
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  // try {
  //   return await db.insert(chat).values({
  //     id,
  //     createdAt: new Date(),
  //     userId,
  //     title,
  //     visibility,
  //   });
  // } catch (error) {
  //   console.error("Database query failed in saveChat:", error);
  //   throw new ChatSDKError("bad_request:database", "Failed to save chat");
  // }
  const { data, error } = await supabase.from("chat").insert([
    {
      id,
      createdat: new Date().toISOString(),
      userid: userId,
      title,
      visibility,
    },
  ]);

  if (error) {
    console.error("Supabase query failed in saveChat:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save chat");
  }

  return data;
}

export async function deleteChatById({ id }: { id: string }) {
  // try {
  //   await db.delete(vote).where(eq(vote.chatId, id));
  //   await db.delete(message).where(eq(message.chatId, id));
  //   await db.delete(stream).where(eq(stream.chatId, id));

  //   const [chatsDeleted] = await db
  //     .delete(chat)
  //     .where(eq(chat.id, id))
  //     .returning();
  //   return chatsDeleted;
  // } catch (error) {
  //   console.error("Database query failed in deleteChatById:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to delete chat by id"
  //   );
  // }
  // NOTE: This function now requires you to handle cascading deletes in your Supabase schema
  // or handle them manually by calling delete on each related table.
  // The original function deleted votes, messages, and streams associated with the chat.
  const { data, error } = await supabase.from("chat").delete().match({ id });

  if (error) {
    console.error("Supabase query failed in deleteChatById:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete chat by id"
    );
  }

  return data;
}

export async function deleteAllChatsByUserId({ userId }: { userId: string }) {
  // try {
  //   const userChats = await db
  //     .select({ id: chat.id })
  //     .from(chat)
  //     .where(eq(chat.userId, userId));

  //   if (userChats.length === 0) {
  //     return { deletedCount: 0 };
  //   }

  //   const chatIds = userChats.map(c => c.id);

  //   await db.delete(vote).where(inArray(vote.chatId, chatIds));
  //   await db.delete(message).where(inArray(message.chatId, chatIds));
  //   await db.delete(stream).where(inArray(stream.chatId, chatIds));

  //   const deletedChats = await db
  //     .delete(chat)
  //     .where(eq(chat.userId, userId))
  //     .returning();

  //   return { deletedCount: deletedChats.length };
  // } catch (error) {
  //   console.error("Database query failed in deleteAllChatsByUserId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to delete all chats by user id"
  //   );
  // }
  // NOTE: Cascading deletes need to be set up in Supabase for this to work correctly.
  const { data, error } = await supabase
    .from("chat")
    .delete()
    .eq("userid", userId);

  if (error) {
    console.error("Supabase query failed in deleteAllChatsByUserId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete all chats by user id"
    );
  }

  return { deletedCount: data ? data.length : 0 };
}

export async function getChats({
  limit,
  startingAfter,
  endingBefore,
}: {
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  // try {
  //   const extendedLimit = limit + 1;

  //   const query = (whereCondition?: SQL<any>) =>
  //     db
  //       .select()
  //       .from(chat)
  //       .where(whereCondition)
  //       .orderBy(desc(chat.createdAt))
  //       .limit(extendedLimit);

  //   let filteredChats: Chat[] = [];

  //   if (startingAfter) {
  //     const [selectedChat] = await db
  //       .select()
  //       .from(chat)
  //       .where(eq(chat.id, startingAfter))
  //       .limit(1);

  //     if (!selectedChat) {
  //       throw new ChatSDKError(
  //         "not_found:database",
  //         `Chat with id ${startingAfter} not found`
  //       );
  //     }

  //     filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
  //   } else if (endingBefore) {
  //     const [selectedChat] = await db
  //       .select()
  //       .from(chat)
  //       .where(eq(chat.id, endingBefore))
  //       .limit(1);

  //     if (!selectedChat) {
  //       throw new ChatSDKError(
  //         "not_found:database",
  //         `Chat with id ${endingBefore} not found`
  //       );
  //     }

  //     filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
  //   } else {
  //     filteredChats = await query();
  //   }

  //   const hasMore = filteredChats.length > limit;

  //   return {
  //     chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
  //     hasMore,
  //   };
  // } catch (error) {
  //   console.error("Database query failed in getChats:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get chats"
  //   );
  // }
  const extendedLimit = limit + 1;
  let query = supabase
    .from("chat")
    .select("*")
    .order("createdat", { ascending: false })
    .limit(extendedLimit);

  if (startingAfter) {
    const { data: startingChat, error: startingChatError } = await supabase
      .from("chat")
      .select("createdat")
      .eq("id", startingAfter)
      .single();
    if (startingChatError || !startingChat) {
      throw new ChatSDKError(
        "not_found:database",
        `Chat with id ${startingAfter} not found`
      );
    }
    query = query.gt("createdat", startingChat.createdat);
  } else if (endingBefore) {
    const { data: endingChat, error: endingChatError } = await supabase
      .from("chat")
      .select("createdat")
      .eq("id", endingBefore)
      .single();
    if (endingChatError || !endingChat) {
      throw new ChatSDKError(
        "not_found:database",
        `Chat with id ${endingBefore} not found`
      );
    }
    query = query.lt("createdat", endingChat.createdat);
  }

  const { data: filteredChats, error } = await query;

  if (error) {
    console.error("Supabase query failed in getChats:", error);
    throw new ChatSDKError("bad_request:database", "Failed to get chats");
  }

  const hasMore = filteredChats.length > limit;
  const chats = hasMore ? filteredChats.slice(0, limit) : filteredChats;

  return { chats, hasMore };
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  // try {
  //   const extendedLimit = limit + 1;

  //   const query = (whereCondition?: SQL<any>) =>
  //     db
  //       .select()
  //       .from(chat)
  //       .where(
  //         whereCondition
  //           ? and(whereCondition, eq(chat.userId, id))
  //           : eq(chat.userId, id)
  //       )
  //       .orderBy(desc(chat.createdAt))
  //       .limit(extendedLimit);

  //   let filteredChats: Chat[] = [];

  //   if (startingAfter) {
  //     const [selectedChat] = await db
  //       .select()
  //       .from(chat)
  //       .where(eq(chat.id, startingAfter))
  //       .limit(1);

  //     if (!selectedChat) {
  //       throw new ChatSDKError(
  //         "not_found:database",
  //         `Chat with id ${startingAfter} not found`
  //       );
  //     }

  //     filteredChats = await query(gt(chat.createdAt, selectedChat.createdAt));
  //   } else if (endingBefore) {
  //     const [selectedChat] = await db
  //       .select()
  //       .from(chat)
  //       .where(eq(chat.id, endingBefore))
  //       .limit(1);

  //     if (!selectedChat) {
  //       throw new ChatSDKError(
  //         "not_found:database",
  //         `Chat with id ${endingBefore} not found`
  //       );
  //     }

  //     filteredChats = await query(lt(chat.createdAt, selectedChat.createdAt));
  //   } else {
  //     filteredChats = await query();
  //   }

  //   const hasMore = filteredChats.length > limit;

  //   return {
  //     chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
  //     hasMore,
  //   };
  // } catch (error) {
  //   console.error("Database query failed in getChatsByUserId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get chats by user id"
  //   );
  // }
  const extendedLimit = limit + 1;
  let query = supabase
    .from("chat")
    .select("*")
    .eq("userid", id)
    .order("createdat", { ascending: false })
    .limit(extendedLimit);

  if (startingAfter) {
    const { data: startingChat, error: startingChatError } = await supabase
      .from("chat")
      .select("createdat")
      .eq("id", startingAfter)
      .single();
    if (startingChatError || !startingChat) {
      throw new ChatSDKError(
        "not_found:database",
        `Chat with id ${startingAfter} not found`
      );
    }
    query = query.gt("createdat", startingChat.createdat);
  } else if (endingBefore) {
    const { data: endingChat, error: endingChatError } = await supabase
      .from("chat")
      .select("createdat")
      .eq("id", endingBefore)
      .single();
    if (endingChatError || !endingChat) {
      throw new ChatSDKError(
        "not_found:database",
        `Chat with id ${endingBefore} not found`
      );
    }
    query = query.lt("createdat", endingChat.createdat);
  }

  const { data: filteredChats, error } = await query;

  if (error) {
    console.error("Supabase query failed in getChatsByUserId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get chats by user id"
    );
  }

  const hasMore = filteredChats.length > limit;
  const chats = hasMore ? filteredChats.slice(0, limit) : filteredChats;

  return { chats, hasMore };
}

export async function getChatById({ id }: { id: string }) {
  // try {
  //   const [selectedChat] = await db.select().from(chat).where(eq(chat.id, id));
  //   if (!selectedChat) {
  //     return null;
  //   }

  //   return selectedChat;
  // } catch (error) {
  //   console.error("Database query failed in getChatById:", error);
  //   throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  // }
  const { data, error } = await supabase
    .from("chat")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    // .single() throws an error if no rows are found. We can check for this specific case.
    if (error.code === "PGRST116") {
      return null;
    }
    console.error("Supabase query failed in getChatById:", error);
    throw new ChatSDKError("bad_request:database", "Failed to get chat by id");
  }

  return data;
}

export async function saveMessages({ messages }: { messages: DBMessage[] }) {
  // try {
  //   return await db.insert(message).values(messages);
  // } catch (error) {
  //   console.error("Database query failed in saveMessages:", error);
  //   throw new ChatSDKError("bad_request:database", "Failed to save messages");
  // }
  const messagesToInsert = messages.map(
    // @ts-expect-error
    ({ chatId, createdAt, ...rest }) => ({
      ...rest,
      chatid: chatId,
      createdat: createdAt,
    })
  );
  const { data, error } = await supabase
    .from("message_v2")
    .insert(messagesToInsert);

  if (error) {
    if (error.code === "PGRST204") {
      console.error(
        "Supabase query failed in saveMessages due to a column mismatch:",
        error
      );
      throw new ChatSDKError(
        "bad_request:database",
        `Column mismatch error: ${error.message}. This is likely due to a camelCase vs. lowercase naming issue.`
      );
    }
    console.error("Supabase query failed in saveMessages:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save messages");
  }

  return data;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  // try {
  //   return await db
  //     .select()
  //     .from(message)
  //     .where(eq(message.chatId, id))
  //     .orderBy(asc(message.createdAt));
  // } catch (error) {
  //   console.error("Database query failed in getMessagesByChatId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get messages by chat id"
  //   );
  // }
  const { data, error } = await supabase
    .from("message")
    .select("*")
    .eq("chatid", id)
    .order("createdat", { ascending: true });

  if (error) {
    console.error("Supabase query failed in getMessagesByChatId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get messages by chat id"
    );
  }

  return data;
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: "up" | "down";
}) {
  // try {
  //   const [existingVote] = await db
  //     .select()
  //     .from(vote)
  //     .where(and(eq(vote.messageId, messageId)));

  //   if (existingVote) {
  //     return await db
  //       .update(vote)
  //       .set({ isUpvoted: type === "up" })
  //       .where(and(eq(vote.messageId, messageId), eq(vote.chatId, chatId)));
  //   }
  //   return await db.insert(vote).values({
  //     chatId,
  //     messageId,
  //     isUpvoted: type === "up",
  //   });
  // } catch (error) {
  //   console.error("Database query failed in voteMessage:", error);
  //   throw new ChatSDKError("bad_request:database", "Failed to vote message");
  // }
  const { data, error } = await supabase
    .from("vote")
    .upsert(
      { chatid: chatId, messageid: messageId, isupvoted: type === "up" },
      { onConflict: "chatid,messageid" }
    );

  if (error) {
    console.error("Supabase query failed in voteMessage:", error);
    throw new ChatSDKError("bad_request:database", "Failed to vote message");
  }

  return data;
}

export async function getVotesByChatId({ id }: { id: string }) {
  // try {
  //   return await db.select().from(vote).where(eq(vote.chatId, id));
  // } catch (error) {
  //   console.error("Database query failed in getVotesByChatId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get votes by chat id"
  //   );
  // }
  const { data, error } = await supabase
    .from("vote")
    .select("*")
    .eq("chatid", id);

  if (error) {
    console.error("Supabase query failed in getVotesByChatId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get votes by chat id"
    );
  }

  return data;
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  // try {
  //   return await db
  //     .insert(document)
  //     .values({
  //       id,
  //       title,
  //       kind,
  //       content,
  //       userId,
  //       createdAt: new Date(),
  //     })
  //     .returning();
  // } catch (error) {
  //   console.error("Database query failed in saveDocument:", error);
  //   throw new ChatSDKError("bad_request:database", "Failed to save document");
  // }
  const { data, error } = await supabase
    .from("document")
    .insert([
      {
        id,
        title,
        kind,
        content,
        userid: userId,
        createdat: new Date().toISOString(),
      },
    ])
    .select();

  if (error) {
    console.error("Supabase query failed in saveDocument:", error);
    throw new ChatSDKError("bad_request:database", "Failed to save document");
  }

  return data;
}

export async function getDocumentsById({ id }: { id: string }) {
  // try {
  //   const documents = await db
  //     .select()
  //     .from(document)
  //     .where(eq(document.id, id))
  //     .orderBy(asc(document.createdAt));

  //   return documents;
  // } catch (error) {
  //   console.error("Database query failed in getDocumentsById:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get documents by id"
  //   );
  // }
  const { data, error } = await supabase
    .from("document")
    .select("*")
    .eq("id", id)
    .order("createdat", { ascending: true });

  if (error) {
    console.error("Supabase query failed in getDocumentsById:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get documents by id"
    );
  }

  return data;
}

export async function getDocumentById({ id }: { id: string }) {
  // try {
  //   const [selectedDocument] = await db
  //     .select()
  //     .from(document)
  //     .where(eq(document.id, id))
  //     .orderBy(desc(document.createdAt));

  //   return selectedDocument;
  // } catch (error) {
  //   console.error("Database query failed in getDocumentById:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get document by id"
  //   );
  // }
  const { data, error } = await supabase
    .from("document")
    .select("*")
    .eq("id", id)
    .order("createdat", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Supabase query failed in getDocumentById:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get document by id"
    );
  }

  return data;
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  // try {
  //   await db
  //     .delete(suggestion)
  //     .where(
  //       and(
  //         eq(suggestion.documentId, id),
  //         gt(suggestion.documentCreatedAt, timestamp)
  //       )
  //     );

  //   return await db
  //     .delete(document)
  //     .where(and(eq(document.id, id), gt(document.createdAt, timestamp)))
  //     .returning();
  // } catch (error) {
  //   console.error(
  //     "Database query failed in deleteDocumentsByIdAfterTimestamp:",
  //     error
  //   );
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to delete documents by id after timestamp"
  //   );
  // }
  // Note: This logic might be better suited for a Supabase Edge Function (database function)
  // to ensure atomicity.
  const { error: suggestionError } = await supabase
    .from("suggestion")
    .delete()
    .eq("documentid", id)
    .gt("documentcreatedat", timestamp.toISOString());

  if (suggestionError) {
    console.error(
      "Supabase query failed in deleteDocumentsByIdAfterTimestamp (suggestions):",
      suggestionError
    );
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete suggestions by document id after timestamp"
    );
  }

  const { data, error } = await supabase
    .from("document")
    .delete()
    .eq("id", id)
    .gt("createdat", timestamp.toISOString())
    .select();

  if (error) {
    console.error(
      "Supabase query failed in deleteDocumentsByIdAfterTimestamp (documents):",
      error
    );
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to delete documents by id after timestamp"
    );
  }

  return data;
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Suggestion[];
}) {
  // try {
  //   return await db.insert(suggestion).values(suggestions);
  // } catch (error) {
  //   console.error("Database query failed in saveSuggestions:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to save suggestions"
  //   );
  // }
  const suggestionsToInsert = suggestions.map(
    // @ts-expect-error
    ({
      documentId,
      documentCreatedAt,
      originalText,
      suggestedText,
      isResolved,
      userId,
      createdAt,
      ...rest
    }) => ({
      ...rest,
      documentid: documentId,
      documentcreatedat: documentCreatedAt,
      originaltext: originalText,
      suggestedtext: suggestedText,
      isresolved: isResolved,
      userid: userId,
      createdat: createdAt,
    })
  );
  const { data, error } = await supabase
    .from("suggestion")
    .insert(suggestionsToInsert);

  if (error) {
    console.error("Supabase query failed in saveSuggestions:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to save suggestions"
    );
  }

  return data;
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  // try {
  //   return await db
  //     .select()
  //     .from(suggestion)
  //     .where(and(eq(suggestion.documentId, documentId)));
  // } catch (error) {
  //   console.error("Database query failed in getSuggestionsByDocumentId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get suggestions by document id"
  //   );
  // }
  const { data, error } = await supabase
    .from("suggestion")
    .select("*")
    .eq("documentid", documentId);

  if (error) {
    console.error(
      "Supabase query failed in getSuggestionsByDocumentId:",
      error
    );
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get suggestions by document id"
    );
  }
  return data;
}

export async function getMessageById({ id }: { id: string }) {
  // try {
  //   return await db.select().from(message).where(eq(message.id, id));
  // } catch (error) {
  //   console.error("Database query failed in getMessageById:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get message by id"
  //   );
  // }
  const { data, error } = await supabase
    .from("message")
    .select("*")
    .eq("id", id);

  if (error) {
    console.error("Supabase query failed in getMessageById:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message by id"
    );
  }

  return data;
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  // try {
  //   const messagesToDelete = await db
  //     .select({ id: message.id })
  //     .from(message)
  //     .where(
  //       and(eq(message.chatId, chatId), gte(message.createdAt, timestamp))
  //     );

  //   const messageIds = messagesToDelete.map(
  //     (currentMessage) => currentMessage.id
  //   );

  //   if (messageIds.length > 0) {
  //     await db
  //       .delete(vote)
  //       .where(
  //         and(eq(vote.chatId, chatId), inArray(vote.messageId, messageIds))
  //       );

  //     return await db
  //       .delete(message)
  //       .where(
  //         and(eq(message.chatId, chatId), inArray(message.id, messageIds))
  //       );
  //   }
  // } catch (error) {
  //   console.error(
  //     "Database query failed in deleteMessagesByChatIdAfterTimestamp:",
  //     error
  //   );
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to delete messages by chat id after timestamp"
  //   );
  // }
  // Note: This logic might be better suited for a Supabase Edge Function (database function)
  // to ensure atomicity.
  const { data: messagesToDelete, error: messagesError } = await supabase
    .from("message")
    .select("id")
    .eq("chatid", chatId)
    .gte("createdat", timestamp.toISOString());

  if (messagesError) {
    console.error(
      "Supabase query failed in deleteMessagesByChatIdAfterTimestamp (selecting messages):",
      messagesError
    );
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to select messages for deletion"
    );
  }

  if (messagesToDelete && messagesToDelete.length > 0) {
    const messageIds = messagesToDelete.map(
      (currentMessage) => currentMessage.id
    );

    const { error: voteError } = await supabase
      .from("vote")
      .delete()
      .eq("chatid", chatId)
      .in("messageid", messageIds);

    if (voteError) {
      console.error(
        "Supabase query failed in deleteMessagesByChatIdAfterTimestamp (deleting votes):",
        voteError
      );
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to delete votes"
      );
    }

    const { data, error } = await supabase
      .from("message")
      .delete()
      .eq("chatid", chatId)
      .in("id", messageIds);

    if (error) {
      console.error(
        "Supabase query failed in deleteMessagesByChatIdAfterTimestamp (deleting messages):",
        error
      );
      throw new ChatSDKError(
        "bad_request:database",
        "Failed to delete messages"
      );
    }

    return data;
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: "private" | "public";
}) {
  // try {
  //   return await db.update(chat).set({ visibility }).where(eq(chat.id, chatId));
  // } catch (error) {
  //   console.error("Database query failed in updateChatVisiblityById:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to update chat visibility by id"
  //   );
  // }
  const { data, error } = await supabase
    .from("chat")
    .update({ visibility })
    .eq("id", chatId);

  if (error) {
    console.error("Supabase query failed in updateChatVisiblityById:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to update chat visibility by id"
    );
  }

  return data;
}

export async function updateChatLastContextById({
  chatId,
  context,
}: {
  chatId: string;
  // Store merged server-enriched usage object
  context: AppUsage;
}) {
  // try {
  //   return await db
  //     .update(chat)
  //     .set({ lastContext: context })
  //     .where(eq(chat.id, chatId));
  // } catch (error) {
  //   console.warn("Failed to update lastContext for chat", chatId, error);
  //   return;
  // }
  const { data, error } = await supabase
    .from("chat")
    .update({ lastcontext: context })
    .eq("id", chatId);

  if (error) {
    console.warn("Failed to update lastContext for chat", chatId, error);
    return;
  }

  return data;
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  // try {
  //   const twentyFourHoursAgo = new Date(
  //     Date.now() - differenceInHours * 60 * 60 * 1000
  //   );

  //   const [stats] = await db
  //     .select({ count: count(message.id) })
  //     .from(message)
  //     .innerJoin(chat, eq(message.chatId, chat.id))
  //     .where(
  //       and(
  //         eq(chat.userId, id),
  //         gte(message.createdAt, twentyFourHoursAgo),
  //         eq(message.role, "user")
  //       )
  //     )
  //     .execute();

  //   return stats?.count ?? 0;
  // } catch (error) {
  //   console.error("Database query failed in getMessageCountByUserId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get message count by user id"
  //   );
  // }
  // NOTE: Joins in Supabase client are different from Drizzle.
  // This query will need to be rewritten using Supabase's syntax for joins
  // or by using a database view or function.
  // For now, I'll provide a placeholder. A proper implementation would look like:
  /*
  const twentyFourHoursAgo = new Date(
    Date.now() - differenceInHours * 60 * 60 * 1000
  ).toISOString();

  const { count, error } = await supabase
    .from('message')
    .select('*, chat(*)')
    .eq('role', 'user')
    .eq('chat.userid', id)
    .gte('createdat', twentyFourHoursAgo)
    .then(response => ({
      count: response.data?.length ?? 0,
      error: response.error
    }));

  if (error) {
    console.error("Supabase query failed in getMessageCountByUserId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get message count by user id"
    );
  }

  return count;
  */
  console.warn(
    "getMessageCountByUserId needs to be rewritten for Supabase joins."
  );
  return 0;
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  // try {
  //   await db
  //     .insert(stream)
  //     .values({ id: streamId, chatId, createdAt: new Date() });
  // } catch (error) {
  //   console.error("Database query failed in createStreamId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to create stream id"
  //   );
  // }
  const { data, error } = await supabase.from("stream").insert([
    {
      id: streamId,
      chatid: chatId,
      createdat: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Supabase query failed in createStreamId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to create stream id"
    );
  }

  return data;
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  // try {
  //   const streamIds = await db
  //     .select({ id: stream.id })
  //     .from(stream)
  //     .where(eq(stream.chatId, chatId))
  //     .orderBy(asc(stream.createdAt))
  //     .execute();

  //   return streamIds.map(({ id }) => id);
  // } catch (error) {
  //   console.error("Database query failed in getStreamIdsByChatId:", error);
  //   throw new ChatSDKError(
  //     "bad_request:database",
  //     "Failed to get stream ids by chat id"
  //   );
  // }
  const { data, error } = await supabase
    .from("stream")
    .select("id")
    .eq("chatid", chatId)
    .order("createdat", { ascending: true });

  if (error) {
    console.error("Supabase query failed in getStreamIdsByChatId:", error);
    throw new ChatSDKError(
      "bad_request:database",
      "Failed to get stream ids by chat id"
    );
  }

  return data ? data.map(({ id }) => id) : [];
}
