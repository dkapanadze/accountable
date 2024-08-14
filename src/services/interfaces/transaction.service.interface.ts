import { ITransaction } from "../../models";

export interface ITransactionService {
  makeTransaction(
    transaction: Partial<ITransaction>,
    bookId: string,
  ): Promise<ITransaction>;
}
