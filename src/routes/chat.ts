import { Router, type Request } from "express";
import { auth } from "../middleware/auth";
import HttpException from "../errors/HttpException";
import { getMessages } from "../db/queries/messages";
import { MESSAGE_PAGE_SIZE } from "../constants";

const chatRoutes = Router();

chatRoutes.get("/:id", auth, async (req: Request<{ id: string }>, res) => {
  const uid = req.uid;
  if (!uid) throw new HttpException(403);

  const messages = await getMessages(uid, req.params.id, MESSAGE_PAGE_SIZE);
  res.send(messages);
});

export default Router().use("/chat", chatRoutes);
