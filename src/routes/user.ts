import { Router, type Request } from "express";
import { findUser, updateUser } from "../db/queries/user";
import { auth } from "../middleware/auth";
import HttpException from "../errors/HttpException";
import { validateData } from "../middleware/validation";
import { userUpdateSchema } from "../db/schema";

const userRoutes = Router();

userRoutes.get("/:id", async (req: Request<{ id: string }>, res) => {
  const id = req.params.id;
  const user = await findUser(id);
  if (!user) throw new HttpException(404);
  const { location, locationUpdated, ...userToSend } = user;
  res.send(userToSend);
});

userRoutes.patch(
  "/:id/update",
  auth,
  validateData(userUpdateSchema),
  async (req: Request<{ id: string }>, res) => {
    const id = req.params.id;
    if (req.uid !== id) {
      throw new HttpException(
        403,
        `Forbidden update request: ${req.uid} cannot update ${id}`,
      );
    }

    await updateUser(req.params.id, req.body);
    return res.sendStatus(204);
  },
);

export default Router().use("/user", userRoutes);
