import { Router } from "express";
import userRoutes from "./user";

const api = Router().use("/user", userRoutes);

export default Router().use("/api", api);
