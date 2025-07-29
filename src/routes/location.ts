import { Router } from "express";
import HttpException from "../errors/HttpException";
import { getUsersNearPoint, updateLocation } from "../db/queries/user";
import { auth } from "../middleware/auth";
import { cacheDistance, getCachedDistance } from "../utils/locationCache";
import { REFRESH_DISTANCE_IF_DECREASES_PAST_METERS } from "../constants";

const locationRoutes = Router();

type Connection = {
  uid: string;
  coordinates: string;
  distance: number;
  name: string;
  pfpId?: string;
  interests?: string[];
};

locationRoutes.post("/sync", auth, async (req, res) => {
  const uid = req.uid;

  if (!uid) {
    throw new HttpException(403);
  }

  await updateLocation(uid, req.body);

  const nearbyUsers = (await getUsersNearPoint(req.body)).filter(
    (item) => item.user.uid !== uid,
  );

  const usersToSend: Connection[] = nearbyUsers.map(({ user, distance }) => {
    let distanceToSend;
    const cachedDistance = getCachedDistance(uid, user.uid);
    if (
      cachedDistance &&
      cachedDistance - distance < REFRESH_DISTANCE_IF_DECREASES_PAST_METERS
    ) {
      distanceToSend = cachedDistance;
    } else {
      cacheDistance(uid, user.uid, distance);
      distanceToSend = distance;
    }

    return {
      uid: user.uid,
      coordinates: req.body,
      distance: distanceToSend,
      name: user.name,
      interests: user.interests ?? undefined,
      pfpId: user.pfpId ?? undefined,
    };
  });

  res.send(usersToSend);
});

export default Router().use("/location", locationRoutes);
