import { MongooseError } from "mongoose";
import AppError from "./AppError";
import { Request, NextFunction, Response } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

export const handleAsyncErrors = (fn: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      if (err instanceof MongooseError) {
        next(new AppError(`Database error: ${err.message}`, 500));
      } else if (err instanceof Error) {
        next(new AppError(`Error: ${err.message}`, 400));
      } else {
        next(new AppError("An unknown error occurred", 500));
      }
    }
  };
};
