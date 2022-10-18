import { Request, Response, NextFunction } from "express";
import HttpException from "../utils/exceptions/http.exception";

export function ErrorMiddleware(
  error: HttpException,
  _: Request,
  res: Response,
  __: NextFunction
): void {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";

  res.status(status).send({
    status,
    message,
  });
}
