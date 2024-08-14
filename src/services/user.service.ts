import { IUser } from "../models";
import { UserRepository } from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";

export class UserService implements IUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async blockUser(userId: string): Promise<IUser> {
    return await this.userRepository.blockUser(userId);
  }
  async findById(userId: string): Promise<IUser> | null {
    return await this.userRepository.findById(userId);
  }
}
