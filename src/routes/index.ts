import { Router } from "express";
import userRoutes from "./user";
import locationRoutes from "./location";
import imageRoutes from "./image";

const api = Router().use(userRoutes).use(locationRoutes).use(imageRoutes);

export default Router().use("/api", api);
