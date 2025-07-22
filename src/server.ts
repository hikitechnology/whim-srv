import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import HttpException from "./errors/HttpException";
import routes from "./routes";
import { initializeApp } from "firebase-admin/app";

initializeApp();

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(routes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof HttpException) {
    return res.sendStatus(err.code);
  }
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
