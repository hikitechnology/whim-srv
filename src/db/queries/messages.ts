import { db } from "..";
import { messagesTable, type MessageInsert } from "../schema/messages";

export async function saveMessage(message: MessageInsert) {
  return (await db.insert(messagesTable).values(message).returning())[0];
}
