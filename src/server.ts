import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import HttpException from "./errors/HttpException";
import routes from "./routes";
import * as FirebaseAdmin from "firebase-admin/app";
import { createServer } from "node:http";
import { Server } from "socket.io";
import connectionHandler from "./socket";
import socketAuth from "./socket/middleware/auth";

const PORT = 3000;

FirebaseAdmin.initializeApp();

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.json());

app.use(routes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof HttpException) {
    return res.sendStatus(err.code);
  }
  res.sendStatus(500);
});

io.use(socketAuth);
io.on("connection", connectionHandler);

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
