import type { InferSelectModel } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  json,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import type { AppUsage } from "../usage";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type user = InferSelectModel<typeof user>;

export const chat = pgTable("chat", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdat: timestamp("createdat").notNull(),
  title: text("title").notNull(),
  userid: uuid("userid")
    .notNull()
    .references(() => user.id),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
  lastcontext: jsonb("lastcontext").$type<AppUsage | null>(),
});

export type chat = InferSelectModel<typeof chat>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const messagedeprecated = pgTable("message", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatid: uuid("chatid")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  content: json("content").notNull(),
  createdat: timestamp("createdat").notNull(),
});

export type messagedeprecated = InferSelectModel<typeof messagedeprecated>;

export const message = pgTable("message_v2", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  chatid: uuid("chatid")
    .notNull()
    .references(() => chat.id),
  role: varchar("role").notNull(),
  parts: json("parts").notNull(),
  attachments: json("attachments").notNull(),
  createdat: timestamp("createdat").notNull(),
});

export type dbmessage = InferSelectModel<typeof message>;

// DEPRECATED: The following schema is deprecated and will be removed in the future.
// Read the migration guide at https://chat-sdk.dev/docs/migration-guides/message-parts
export const votedeprecated = pgTable(
  "vote",
  {
    chatid: uuid("chatid")
      .notNull()
      .references(() => chat.id),
    messageid: uuid("messageid")
      .notNull()
      .references(() => messagedeprecated.id),
    isupvoted: boolean("isupvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatid, table.messageid] }),
    };
  }
);

export type votedeprecated = InferSelectModel<typeof votedeprecated>;

export const vote = pgTable(
  "vote_v2",
  {
    chatid: uuid("chatid")
      .notNull()
      .references(() => chat.id),
    messageid: uuid("messageid")
      .notNull()
      .references(() => message.id),
    isupvoted: boolean("isupvoted").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.chatid, table.messageid] }),
    };
  }
);

export type vote = InferSelectModel<typeof vote>;

export const document = pgTable(
  "document",
  {
    id: uuid("id").notNull().defaultRandom(),
    createdat: timestamp("createdat").notNull(),
    title: text("title").notNull(),
    content: text("content"),
    kind: varchar("text", { enum: ["text", "code", "image", "sheet"] })
      .notNull()
      .default("text"),
    userid: uuid("userid")
      .notNull()
      .references(() => user.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.id, table.createdat] }),
    };
  }
);

export type document = InferSelectModel<typeof document>;

export const suggestion = pgTable(
  "suggestion",
  {
    id: uuid("id").notNull().defaultRandom(),
    documentid: uuid("documentid").notNull(),
    documentcreatedat: timestamp("documentcreatedat").notNull(),
    originaltext: text("originaltext").notNull(),
    suggestedtext: text("suggestedtext").notNull(),
    description: text("description"),
    isresolved: boolean("isresolved").notNull().default(false),
    userid: uuid("userid")
      .notNull()
      .references(() => user.id),
    createdat: timestamp("createdat").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    documentref: foreignKey({
      columns: [table.documentid, table.documentcreatedat],
      foreignColumns: [document.id, document.createdat],
    }),
  })
);

export type suggestion = InferSelectModel<typeof suggestion>;

export const stream = pgTable(
  "stream",
  {
    id: uuid("id").notNull().defaultRandom(),
    chatid: uuid("chatid").notNull(),
    createdat: timestamp("createdat").notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.id] }),
    chatref: foreignKey({
      columns: [table.chatid],
      foreignColumns: [chat.id],
    }),
  })
);

export type stream = InferSelectModel<typeof stream>;

export const healthcheck = pgTable("healthcheck", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  status: text("status").notNull(),
  createdat: timestamp("createdat").notNull().defaultNow(),
});
