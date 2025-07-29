import { REFRESH_DISTANCE_AFTER_MINUTES } from "../constants";
import { msToM } from "./time";

// only want to send updated distance every 5 minutes per user pair
type CachedUserPair = {
  uid1: string;
  uid2: string;
  cachedDistance: number;
  timeCached: number;
};

const cachedUserPairs: CachedUserPair[] = [];

export function getCachedDistance(uid1: string, uid2: string) {
  const cachedPair = cachedUserPairs.find(
    (pair) =>
      ((pair.uid1 === uid1 && pair.uid2 === uid2) ||
        (pair.uid1 === uid2 && pair.uid2 === uid1)) &&
      msToM(Date.now() - pair.timeCached) < REFRESH_DISTANCE_AFTER_MINUTES,
  );

  return cachedPair?.cachedDistance ?? null;
}

export function cacheDistance(uid1: string, uid2: string, distance: number) {
  const existingIndex = cachedUserPairs.findIndex(
    (pair) =>
      (pair.uid1 === uid1 && pair.uid2 === uid2) ||
      (pair.uid1 === uid2 && pair.uid2 === uid1),
  );
  const newEntry = {
    uid1,
    uid2,
    cachedDistance: distance,
    timeCached: Date.now(),
  };

  if (existingIndex !== -1) {
    cachedUserPairs[existingIndex] = newEntry;
  } else {
    cachedUserPairs.push({
      uid1,
      uid2,
      cachedDistance: distance,
      timeCached: Date.now(),
    });
  }

  return distance;
}
