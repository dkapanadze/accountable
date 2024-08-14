import { IUser } from "../../models";

export interface IUserService {
  blockUser(userId: string): Promise<IUser>;
  findById(userId: string): Promise<IUser> | null;
}
