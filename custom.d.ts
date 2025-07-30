import { Request } from "express-serve-static-core";
import { Socket } from "socket.io";

declare module "express-serve-static-core" {
  export interface Request {
    uid?: string;
  }
}

declare module "socket.io" {
  export interface Socket {
    uid: string;
  }
}
