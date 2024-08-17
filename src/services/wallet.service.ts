import { WalletRepository } from "../repositories";
import AppError from "../utils/AppError";
import { TransactionTypeEnum } from "../models/transaction.model";
import { BorrowLimitEnum, IWallet, WalletStatusEnum } from "../models";
import { IBookService, IWalletService } from "./interfaces";
import { IUserService } from "./interfaces/user.service.interface";

export class WalletService implements IWalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly userService: IUserService,
    private readonly bookService: IBookService,
  ) {}

  async deductUserBalance(
    userId: string,
    amount: number,
    transactionType: string,
    bookId?: string,
  ): Promise<IWallet> {
    const wallet = await this.walletRepository.findWalletByUserId(userId);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    if (wallet.balance < amount) {
      throw new AppError("Insufficient balance", 400);
    }

    if (transactionType === TransactionTypeEnum.LATE_FEE) {
      await this.addLateFee(wallet._id, bookId, amount);
    }

    return await this.walletRepository.deductBalance(wallet._id, amount);
  }

  async addLateFee(
    walletId: string,
    bookId: string,
    amount: number,
  ): Promise<Partial<IWallet>> {
    const updatedWallet = await this.walletRepository.addLateFee(
      walletId,
      bookId,
      amount,
    );

    if (
      updatedWallet.borrowedBook.lateFee >= updatedWallet.borrowedBook.price
    ) {
      await this.finalizeBookSale(
        walletId,
        bookId,
        updatedWallet.userId.toString(),
      );
    }

    return updatedWallet;
  }

  async finalizeBookSale(
    walletId: string,
    bookId: string,
    userId: string,
  ): Promise<void> {
    await this.userService.blockUser(userId);
    await this.walletRepository.updateWalletById(walletId, {
      status: WalletStatusEnum.INACTIVE,
    });
    await this.bookService.markBookAsSold(bookId, walletId, userId);
  }

  async addBookToWallet(
    userId: string,
    bookId: string,
    bookPrice: number,
  ): Promise<void> {
    const wallet = await this.walletRepository.findWalletByUserId(userId);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    await this.walletRepository.updateWalletById(wallet._id, {
      $push: { borrowedBooks: { bookId, price: bookPrice } },
    });
  }

  async getUserWallet(
    userId: string,
    walletId: string,
  ): Promise<IWallet> | null {
    return await this.walletRepository.getUserWallet(userId, walletId);
  }

  async checkBorrowLimit(
    userId: string,
    bookId: string,
    price: number,
  ): Promise<void> {
    const wallet = await this.walletRepository.findWalletByUserId(userId);
    let borrowedBooksSum = price;

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    const borrowedBooks = wallet.borrowedBooks;

    if (borrowedBooks.length === BorrowLimitEnum.BORROW_LIMIT) {
      throw new AppError("Borrow limit reached", 400);
    }

    const checkBook = borrowedBooks.find(
      (borrowedBook) => borrowedBook.bookId.toString() === bookId,
    );

    if (checkBook) {
      throw new AppError("Book already borrowed", 400);
    }

    if (wallet.borrowedBooks.length > 0) {
      borrowedBooksSum = wallet.borrowedBooks.reduce(
        (total, borrowedBook) => total + borrowedBook.price,
        0,
      );
    }

    const seventyPercentOfBalance = wallet.balance * BorrowLimitEnum.SUM_LIMIT;

    if (borrowedBooksSum >= seventyPercentOfBalance) {
      throw new AppError(
        "wallet balance should be more then 70% of borrowed books price sum",
        400,
      );
    }
  }

  async getUsersWithDueBooks(daysCount?: number): Promise<IWallet[] | []> {
    return await this.walletRepository.getUsersWithDueBooks(daysCount);
  }

  async findById(walletId: string): Promise<IWallet> | null {
    return await this.walletRepository.findById(walletId);
  }
}
