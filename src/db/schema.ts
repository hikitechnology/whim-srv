import type { InferSelectModel } from "drizzle-orm";
import { boolean, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

type Interests = string[];

type Trait = {
  trait: string;
  description: string;
};
type Traits = [Trait?, Trait?, Trait?];

type Favorite = {
  category: string;
  item: string;
};
type Favorites = [Favorite?, Favorite?, Favorite?];

type ConversationStarters = [string?, string?, string?];

export const usersTable = pgTable("users", {
  uid: text().primaryKey(),
  name: text().notNull(),
  bio: text(),
  interests: jsonb().$type<Interests>(),
  traits: jsonb().$type<Traits>(),
  favorites: jsonb().$type<Favorites>(),
  lookingFor: text(),
  conversationStarters: jsonb().$type<ConversationStarters>(),
  showInterests: boolean().notNull().default(false),
  showTraits: boolean().notNull().default(false),
  showFavorites: boolean().notNull().default(false),
  showLookingFor: boolean().notNull().default(false),
  showConversationStarters: boolean().notNull().default(false),
});

export type User = InferSelectModel<typeof usersTable>;

export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable);
export const userUpdateSchema = createUpdateSchema(usersTable);
