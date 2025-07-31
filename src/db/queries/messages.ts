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
