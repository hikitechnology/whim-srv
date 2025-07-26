import { Router, type Request } from "express";
import { findUser, getAllUsers, updateUser } from "../db/queries/user";
import { auth } from "../middleware/auth";
import HttpException from "../errors/HttpException";
import { validateData } from "../middleware/validation";
import { userUpdateSchema } from "../db/schema";
import multer from "multer";

const userRoutes = Router();

// for testing only
userRoutes.get("/all", async (_req, res) => {
  const users = await getAllUsers();
  res.send(users);
});

userRoutes.get("/:id", async (req: Request<{ id: string }>, res) => {
  const id = req.params.id;
  const user = await findUser(id);
  if (!user) throw new HttpException(404);
  res.send(user);
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
