import { faker } from "@faker-js/faker";
import { usersTable, type UserInsert } from "../db/schema/users";
import { arrayOf } from "./utils";
import { db } from "../db";

async function main() {
  const data: UserInsert[] = [];

  for (let i = 0; i < 20; i++) {
    const userHas = {
      interests: faker.datatype.boolean(),
      traits: faker.datatype.boolean(),
      favorites: faker.datatype.boolean(),
      lookingFor: faker.datatype.boolean(),
      conversationStarters: faker.datatype.boolean(),
    };

    data.push({
      uid: faker.string.uuid(),
      name: faker.person.fullName(),
      bio: faker.person.bio(),
      ...(userHas.interests
        ? {
            interests: arrayOf(() => faker.lorem.words({ min: 1, max: 2 }), 10),
            showInterests: true,
          }
        : {}),
      ...(userHas.traits
        ? {
            traits: arrayOf(
              () => ({
                trait: faker.lorem.words({ min: 1, max: 2 }),
                description: faker.lorem.sentence(),
              }),
              3,
            ),
            showTraits: true,
          }
        : {}),
      ...(userHas.favorites
        ? {
            favorites: arrayOf(
              () => ({
                category: faker.lorem.word(),
                item: faker.lorem.words({ min: 1, max: 3 }),
              }),
              3,
            ),
            showFavorites: true,
          }
        : {}),
      ...(userHas.lookingFor
        ? {
            lookingFor: faker.lorem.sentences({ min: 1, max: 3 }),
            showLookingFor: true,
          }
        : {}),
      ...(userHas.conversationStarters
        ? {
            conversationStarters: arrayOf(() => faker.lorem.sentence(), 3),
            showConversationStarters: true,
          }
        : {}),
    });
  }

  console.log("seed start");
  await db.insert(usersTable).values(data);
  console.log("seed done");
}

main();
