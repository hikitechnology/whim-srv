import { faker } from "@faker-js/faker";

export function arrayOf<T>(item: () => T, maxItems: number) {
  const length = faker.number.int({ min: 1, max: maxItems });
  return Array.from({ length }, item);
}
