import {
  BookRepository,
  TransactionRepository,
  UserRepository,
  WalletRepository,
} from "../../repositories";
import { BookService } from "../book.service";
import {
  IBookService,
  ITransactionService,
  IWalletService,
} from "../interfaces";
import { IUserService } from "../interfaces/user.service.interface";
import { TransactionService } from "../transaction.service";
import { UserService } from "../user.service";
import { WalletService } from "../wallet.service";

export function createBookService(): IBookService {
  const bookRepository = new BookRepository();
  return new BookService(bookRepository);
}

export function createWalletService(): IWalletService {
  const walletRepository = new WalletRepository();
  const userService: IUserService = createUserService();
  const bookService: IBookService = createBookService();
  return new WalletService(walletRepository, userService, bookService);
}

export function createTransactionService(): ITransactionService {
  const transactionRepository = new TransactionRepository();
  const userService: IUserService = createUserService();
  const walletService: IWalletService = createWalletService();
  const bookService: IBookService = createBookService();
  return new TransactionService(
    transactionRepository,
    userService,
    walletService,
    bookService,
  );
}

export function createUserService(): IUserService {
  const userRepository = new UserRepository();
  return new UserService(userRepository);
}
