import { Request, Response, NextFunction } from "express";
import { TransactionTypeEnum } from "../models/transaction.model";

import AppError from "../utils/AppError";
import { bookService } from "../routes/book.routes";
import { walletService } from "../routes/transaction.routes";
import { userServices } from "../routes/user.routes";
import { StatusEnum, WalletStatusEnum } from "../models";

export const reservationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { bookId, userId, type, walletId } = req.body;

  try {
    if (type === TransactionTypeEnum.RESERVATION) {
      await checkStatusAndWallet(walletId, userId);
      const bookToReserve = await bookService.checkBookAvailability(bookId);
      await walletService.checkBorrowLimit(userId, bookId, bookToReserve.price);
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
};

const checkStatusAndWallet = async (walletId: string, userId: string) => {
  const user = await userServices.findById(userId);

  const wallet = await walletService.getUserWallet(userId, walletId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status === StatusEnum.BANNED) {
    throw new AppError("User is banned", 400);
  }

  if (!wallet) {
    throw new AppError("Wallet is not associated with this user", 404);
  }

  if (wallet.status === WalletStatusEnum.INACTIVE) {
    throw new AppError("Wallet is blocked", 400);
  }

  const now = new Date();
  const overdueBooks = wallet.borrowedBooks.filter(
    (book) => book.reservationEndDate < now,
  );

  if (overdueBooks.length > 0) {
    throw new AppError(
      "You have overdue books. Please return before reserving new one.",
      400,
    );
  }
};
