import { Router } from "express";
import userRoutes from "./user";
import locationRoutes from "./location";

const api = Router().use(userRoutes).use(locationRoutes);

export default Router().use("/api", api);
