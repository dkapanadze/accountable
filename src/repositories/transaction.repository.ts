import Transaction from "../models/transaction.model";
import { ITransaction } from "../models/transaction.model";

export class TransactionRepository {
  constructor() {}

  async create(transaction: Partial<ITransaction>): Promise<ITransaction> {
    return Transaction.create(transaction);
  }
}
