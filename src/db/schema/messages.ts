import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const messagesTable = pgTable("messages", {
  id: serial().primaryKey(),
  sender: text()
    .notNull()
    .references(() => usersTable.uid),
  receiver: text()
    .notNull()
    .references(() => usersTable.uid),
  message: text().notNull(),
  timestamp: timestamp().notNull().defaultNow(),
});

export type Message = InferSelectModel<typeof messagesTable>;
export type MessageInsert = InferInsertModel<typeof messagesTable>;
