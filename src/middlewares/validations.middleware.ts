import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "class-validator";
import { ParsedQs } from "qs";

import AppError from "../utils/AppError";

export function validateDto<T>(type: new () => T) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(type, req.body);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const errorMessage = errors.map((err) => {
        return Object.values(err.constraints).join(", ");
      });
      return next(new AppError(`Validation failed  ${errorMessage}`, 400));
    }

    req.body = dto;
    next();
  };
}

export function validateQueryDto<T>(type: new () => T) {
  return async (
    req: Request<{}, {}, {}, ParsedQs>,
    res: Response,
    next: NextFunction,
  ) => {
    const dto = plainToClass(type, req.query);
    const errors: ValidationError[] = await validate(dto);

    if (errors.length > 0) {
      const errorMessage = errors
        .map((err) => {
          return Object.values(err.constraints || {}).join(", ");
        })
        .join("; ");
      return next(new AppError(`Validation failed: ${errorMessage}`, 400));
    }

    req.query = dto as any;
    next();
  };
}
