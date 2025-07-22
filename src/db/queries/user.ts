import { eq } from "drizzle-orm";
import { db } from "..";
import { DEFAULT_DISPLAY_NAME } from "../../constants";
import { usersTable, type User } from "../schema";

type UserQuery = Partial<Omit<User, "uid">>;

export async function createUserIfNotExists(uid: string) {
  await db
    .insert(usersTable)
    .values({
      uid,
      name: DEFAULT_DISPLAY_NAME,
    })
    .onConflictDoNothing();
}

export async function findUser(uid: string) {
  return (await db.select().from(usersTable).where(eq(usersTable.uid, uid)))[0];
}

export async function updateUser(uid: string, params: UserQuery) {
  await db.update(usersTable).set(params).where(eq(usersTable.uid, uid));
}
