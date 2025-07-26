import { Router } from "express";
import HttpException from "../errors/HttpException";
import { getUsersNearPoint, updateLocation } from "../db/queries/user";
import { auth } from "../middleware/auth";

const locationRoutes = Router();

type Connection = {
  uid: string;
  coordinates: string;
  distance: number;
};

locationRoutes.post("/sync", auth, async (req, res) => {
  if (!req.uid) {
    throw new HttpException(403);
  }

  await updateLocation(req.uid, req.body);

  const nearbyUsers = (await getUsersNearPoint(req.body)).filter(
    (item) => item.user.uid !== req.uid,
  );

  const usersToSend: Connection[] = nearbyUsers.map(({ user, distance }) => ({
    uid: user.uid,
    coordinates: req.body,
    distance,
  }));

  res.send(usersToSend);
});

export default Router().use("/location", locationRoutes);
