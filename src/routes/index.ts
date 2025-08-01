import { Router } from "express";
import userRoutes from "./user";
import locationRoutes from "./location";
import imageRoutes from "./image";
import chatRoutes from "./chat";

const api = Router()
  .use(userRoutes)
  .use(locationRoutes)
  .use(imageRoutes)
  .use(chatRoutes);

export default Router().use("/api", api);
