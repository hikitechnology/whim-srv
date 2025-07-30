import { reset } from "drizzle-seed";
import { usersTable } from "../db/schema/users";
import { db } from "../db";

async function main() {
  console.log("resetting db");
  await reset(db, { usersTable });
  console.log("db reset done");
}

main();
