import { walletService } from "../routes/transaction.routes";
import { IWalletService } from "./interfaces";

class ReminderService {
  constructor(private readonly walletService: IWalletService) {}

  async getUsersWithDueBooks(daysCount?: number) {
    return await this.walletService.getUsersWithDueBooks(daysCount);
  }
}

export const reminderService = new ReminderService(walletService);
