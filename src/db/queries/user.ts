import { and, eq, getTableColumns, gt, sql } from "drizzle-orm";
import { db } from "..";
import {
  CONNECTION_RADIUS_METERS,
  DEFAULT_DISPLAY_NAME,
  LOCATION_EXPIRES_MINUTES,
} from "../../constants";
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
  return db.update(usersTable).set(params).where(eq(usersTable.uid, uid));
}

export async function getAllUsers() {
  return db.select().from(usersTable);
}

export async function updateLocation(
  uid: string,
  coords: { x: number; y: number },
) {
  return db
    .update(usersTable)
    .set({
      location: coords,
      locationUpdated: sql`NOW()`,
    })
    .where(eq(usersTable.uid, uid));
}

export async function getUsersNearPoint(point: {
  x: number;
  y: number;
}): Promise<
  {
    user: User;
    distance: number;
  }[]
> {
  const users = await db
    .select({
      ...getTableColumns(usersTable),
      distance: sql<number>`ST_Distance(${usersTable.location}::geography, ST_MakePoint(${point.x}, ${point.y})::geography)`,
    })
    .from(usersTable)
    .where(
      and(
        sql`ST_DWithin(${usersTable.location}::geography, ST_MakePoint(${point.x}, ${point.y})::geography, ${CONNECTION_RADIUS_METERS})`,
        gt(
          usersTable.locationUpdated,
          sql`NOW() - ${LOCATION_EXPIRES_MINUTES} * (INTERVAL '1 MINUTE')`,
        ),
      ),
    );

  return users.map((userWithDistance) => {
    const { distance, ...user } = userWithDistance;
    return {
      user,
      distance,
    };
  });
}
