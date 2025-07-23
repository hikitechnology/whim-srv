import type { InferSelectModel } from "drizzle-orm";
import { boolean, jsonb, pgTable, text } from "drizzle-orm/pg-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import z from "zod";

const Interests = z.array(z.string()).max(10).optional();
type InterestsType = z.infer<typeof Interests>;

const Trait = z.object({
  trait: z.string(),
  description: z.string(),
});
const Traits = z.array(Trait).max(3).optional();
type TraitsType = z.infer<typeof Traits>;

const Favorite = z.object({
  category: z.string(),
  item: z.string(),
});
const Favorites = z.array(Favorite).max(3).optional();
type FavoritesType = z.infer<typeof Favorites>;

const ConversationStarters = z.array(z.string()).max(3).optional();
type ConversationStartersType = z.infer<typeof ConversationStarters>;

export const usersTable = pgTable("users", {
  uid: text().primaryKey(),
  name: text().notNull(),
  bio: text(),
  interests: jsonb().$type<InterestsType>(),
  traits: jsonb().$type<TraitsType>(),
  favorites: jsonb().$type<FavoritesType>(),
  lookingFor: text(),
  conversationStarters: jsonb().$type<ConversationStartersType>(),
  showInterests: boolean().notNull().default(false),
  showTraits: boolean().notNull().default(false),
  showFavorites: boolean().notNull().default(false),
  showLookingFor: boolean().notNull().default(false),
  showConversationStarters: boolean().notNull().default(false),
});

export type User = InferSelectModel<typeof usersTable>;

const schemaRefinements = {
  interests: Interests,
  traits: Traits,
  favorites: Favorites,
  conversationStarters: ConversationStarters,
};

export const userSelectSchema = createSelectSchema(
  usersTable,
  schemaRefinements,
);
export const userInsertSchema = createInsertSchema(
  usersTable,
  schemaRefinements,
);
export const userUpdateSchema = createUpdateSchema(
  usersTable,
  schemaRefinements,
);
