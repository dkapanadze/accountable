import mongoose, { ObjectId, UpdateQuery } from "mongoose";
import { IWallet } from "../models";
import Decimal from "decimal.js";
import { addDays } from "date-fns";
import Wallet, { IBorrowedBook } from "../models/wallet.model";
import AppError from "../utils/AppError";

export class WalletRepository {
  constructor() {}

  async create() {
    return "user create";
  }

  async findWalletByUserId(userId: string): Promise<IWallet> {
    return Wallet.findOne({ userId }).exec();
  }

  async findById(walletId: string): Promise<IWallet> | null {
    return Wallet.findById(walletId).exec();
  }

  async updateWalletById(
    walletId: string,
    updateInput: UpdateQuery<IWallet>,
  ): Promise<IWallet> | null {
    return Wallet.findByIdAndUpdate(walletId, updateInput, {
      new: true,
    }).exec();
  }

  async deductBalance(walletId: string, amount: number): Promise<IWallet> {
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      throw new AppError("Wallet not found", 400);
    }

    const currentBalance = new Decimal(wallet.balance);
    const updatedBalance = currentBalance.minus(new Decimal(amount));

    return Wallet.findByIdAndUpdate(
      walletId,
      { balance: updatedBalance.toNumber() },
      { new: true },
    );
  }

  async addLateFee(
    walletId: string,
    bookId: string,
    amount: number,
  ): Promise<{
    borrowedBook: IBorrowedBook;
    wallet: string;
    userId: mongoose.Types.ObjectId;
  }> {
    const wallet = await Wallet.findOne({
      _id: walletId,
      "borrowedBooks.bookId": bookId,
    });

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    const borrowedBook = wallet.borrowedBooks.find(
      (book) => book.bookId.toString() === bookId.toString(),
    );
    console.log(borrowedBook, "borrowedBook");
    if (!borrowedBook) {
      throw new AppError("Book not found in wallet", 404);
    }

    const currentLateFee = new Decimal(borrowedBook.lateFee || 0);
    console.log(currentLateFee, "currentLateFee");
    const updatedLateFee = currentLateFee.plus(new Decimal(amount));

    const updatedWallet = await Wallet.findOneAndUpdate(
      { _id: walletId, "borrowedBooks.bookId": bookId },
      { $set: { "borrowedBooks.$.lateFee": updatedLateFee.toNumber() } },
      { new: true },
    ).lean();
    console.log(updatedWallet, "updatedWallet");
    const updatedBorrowedBook = updatedWallet.borrowedBooks.find(
      (book) => book.bookId.toString() === bookId.toString(),
    );

    return {
      borrowedBook: updatedBorrowedBook,
      wallet: updatedWallet._id,
      userId: updatedWallet.userId,
    };
  }

  async getUsersWithDueBooks(daysCount?: number) {
    const now = new Date();

    return Wallet.aggregate([
      {
        $unwind: "$borrowedBooks",
      },
      {
        $match: {
          "borrowedBooks.reservationEndDate": {
            $lte: daysCount !== undefined ? addDays(now, daysCount) : now,
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$user",
      },
      {
        $lookup: {
          from: "books",
          localField: "borrowedBooks.bookId",
          foreignField: "_id",
          as: "book",
          pipeline: [
            {
              $project: {
                _id: 0,
                title: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: "$book",
      },
      {
        $project: {
          borrowedBooks: 1,
          user: 1,
          book: 1,
        },
      },
    ]).exec();
  }
}
