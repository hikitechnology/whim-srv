import type { RequestHandler } from "express";
import { getAuth } from "firebase-admin/auth";
import HttpException from "../errors/HttpException";
import { createUserIfNotExists } from "../db/queries/user";

export const auth: RequestHandler = async (req, _res, next) => {
  try {
    const authToken = req.headers.authorization?.split(" ")[1];
    if (!authToken) {
      throw new HttpException(401);
    }

    const auth = getAuth();
    const { uid } = await auth.verifyIdToken(authToken);
    await createUserIfNotExists(uid);
    req.uid = uid;
    return next();
  } catch (error) {
    if (error instanceof Error && !(error instanceof HttpException)) {
      const httpError = new HttpException(401, error);
      return next(httpError);
    }
    return next(error);
  }
};
