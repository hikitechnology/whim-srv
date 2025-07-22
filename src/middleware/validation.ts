import type { RequestHandler } from "express";
import { type ZodObject } from "zod";
import HttpException from "../errors/HttpException";

export function validateData(schema: ZodObject<any, any>): RequestHandler {
  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof Error) {
        const httpException = new HttpException(400, error);
        return next(httpException);
      }
      return next(error);
    }
  };
}
