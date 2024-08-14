import { Request, Response, NextFunction } from "express";
import { IUser, RoleEnum } from "../models";

export interface RequestWithUser extends Request {
  user?: IUser;
}
export const requireAdminAccess = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
): void => {
  const user: IUser = req.user;
  if (user && user.role === RoleEnum.ADMIN) {
    next();
  } else {
    res.status(403).json({ message: "No Permission" });
  }
};
