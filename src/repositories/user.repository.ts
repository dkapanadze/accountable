import User, { StatusEnum } from "../models/user.model";

export class UserRepository {
  constructor() {}

  async blockUser(userId: string) {
    return User.findByIdAndUpdate(
      userId,
      { status: StatusEnum.BANNED },
      { new: true },
    );
  }

  async findById(userId: string) {
    return User.findById(userId);
  }
}
