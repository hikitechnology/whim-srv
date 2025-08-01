import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
import { db } from "..";
import {
  messagesTable,
  type Message,
  type MessageInsert,
} from "../schema/messages";

export async function saveMessage(message: MessageInsert): Promise<Message> {
  const inserted = (
    await db.insert(messagesTable).values(message).returning()
  )[0];
  console.log(inserted);
  if (!inserted) {
    throw new Error("Failed to save message to DB");
  }
  return inserted;
}

export async function getMessages(
  uid1: string,
  uid2: string,
  count?: number,
  startingFrom?: number,
): Promise<Message[]> {
  const query = db
    .select()
    .from(messagesTable)
    .where(
      and(
        or(
          and(eq(messagesTable.sender, uid1), eq(messagesTable.receiver, uid2)),

          and(eq(messagesTable.receiver, uid1), eq(messagesTable.sender, uid2)),
        ),
        startingFrom ? lt(messagesTable.id, startingFrom) : undefined,
      ),
    )
    .orderBy(desc(messagesTable.id));
  if (count) {
    query.limit(count);
  }
  const result = await query;
  return result;
}
