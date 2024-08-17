import { IWallet } from "../../models";

export interface IWalletService {
  deductUserBalance(
    userId: string,
    amount: number,
    transactionType: string,
    bookId?: string,
  ): Promise<IWallet>;
  addLateFee(
    walletId: string,
    bookId: string,
    amount: number,
  ): Promise<Partial<IWallet>>;
  finalizeBookSale(
    walletId: string,
    bookId: string,
    userId: string,
  ): Promise<void>;
  addBookToWallet(
    userId: string,
    bookId: string,
    bookPrice: number,
  ): Promise<void>;
  checkBorrowLimit(
    userId: string,
    bookId: string,
    price: number,
  ): Promise<void>;
  getUsersWithDueBooks(daysCount: number): Promise<IWallet[]> | [];
  findById(walletId: string): Promise<IWallet> | null;
  getUserWallet(userId: string, walletId: string): Promise<IWallet> | null;
}
