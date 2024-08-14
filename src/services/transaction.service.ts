import {
  ITransaction,
  TransactionAmountEnum,
  TransactionTypeEnum,
} from "../models/transaction.model";
import { TransactionRepository } from "../repositories/transaction.repository";

import BookOperation, {
  OperationTypeEnum,
} from "../models/BookOperation.model";
import {
  IBookService,
  ITransactionService,
  IWalletService,
} from "./interfaces";
import { IUserService } from "./interfaces/user.service.interface";

export class TransactionService implements ITransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly userService: IUserService,
    private readonly walletService: IWalletService,
    private readonly bookService: IBookService,
  ) {}

  async makeTransaction(
    transaction: Partial<ITransaction>,
    bookId: string,
  ): Promise<ITransaction> {
    if (transaction.type === TransactionTypeEnum.RESERVATION) {
      transaction.amount = TransactionAmountEnum.RESERVATION_AMOUNT;
    } else {
      transaction.amount = TransactionAmountEnum.LATE_FEE_AMOUNT;
    }
    console.log("transaction", transaction);
    console.log("bookId", bookId);
    const newTransaction = await this.transactionRepository.create(transaction);

    await this.walletService.deductUserBalance(
      newTransaction.userId.toString(),
      newTransaction.amount,
      transaction.type,
      bookId,
    );

    if (newTransaction.type === TransactionTypeEnum.RESERVATION) {
      const reservedBook = await this.bookService.reserveBook(
        newTransaction.userId.toString(),
        bookId,
      );

      await this.walletService.addBookToWallet(
        newTransaction.userId.toString(),
        bookId,
        reservedBook.price,
      );

      await BookOperation.create({
        userId: newTransaction.userId,
        bookId: bookId,
        walletId: transaction.walletId,
        operationType: OperationTypeEnum.RESERVATION,
      });
    }

    return newTransaction;
  }
}
