import mongoose, { Schema } from "mongoose";
import { IUser } from "./user.model";
import { IBook } from "./book.model";
import { addDays } from "date-fns";

export enum CurrencyEnum {
  USD = "USD",
  EUR = "EUR",
  GBP = "GBP",
  JPY = "JPY",
  CNY = "CNY",
}

export enum ReminderEnums {
  DUE_DATE = 2,
  LATE_RETURN = 7,
}

export enum WalletStatusEnum {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum BorrowDurationEnum {
  ONE_WEEK = 7,
  TWO_WEEKS = 14,
  ONE_MONTH = 30,
  TWO_MONTHS = 60,
}
export interface IBorrowedBook {
  bookId: Schema.Types.ObjectId | string;
  price: number;
  lateFee: number;
  reservedDate: Date;
  reservationEndDate: Date;
}

export enum BorrowLimitEnum {
  BORROW_LIMIT = 3,
  SUM_LIMIT = 0.7,
}

export interface IWallet {
  _id: string;
  balance: number;
  currency: string;
  status: WalletStatusEnum;
  name: string;
  borrowedBooks: IBorrowedBook[];

  userId: mongoose.Types.ObjectId;
  user?: IUser;
  book?: IBook;
}

export const WalletSchema: Schema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      enum: Object.values(CurrencyEnum),
      default: CurrencyEnum.EUR,
    },
    status: {
      type: String,
      enum: Object.values(WalletStatusEnum),
      required: true,
      default: WalletStatusEnum.ACTIVE,
    },

    name: {
      type: String,
      required: true,
    },
    borrowedBooks: [
      {
        bookId: {
          type: Schema.Types.ObjectId,
          ref: "Book",
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        lateFee: {
          type: Number,
          required: true,
          default: 0,
        },
        reservedDate: {
          type: Date,
          required: true,
          default: Date.now,
        },
        reservationEndDate: {
          type: Date,
          required: true,
          default: function () {
            const now = new Date();
            return addDays(now, BorrowDurationEnum.TWO_WEEKS);
          },
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wallet = mongoose.model<IWallet>("Wallet", WalletSchema);

export default Wallet;
