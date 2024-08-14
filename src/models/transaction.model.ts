import mongoose from "mongoose";
import { Document } from "mongoose";

export enum TransactionTypeEnum {
  RESERVATION = "RESERVATION",
  LATE_FEE = "LATE_FEE",
}

export enum TransactionAmountEnum {
  RESERVATION_AMOUNT = 3,
  LATE_FEE_AMOUNT = 0.2,
}

export enum TransactionStatusEnum {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  REFUNDED = "REFUNDED",
}

export interface ITransaction extends Document {
  id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId | string;
  amount: number;
  type: TransactionTypeEnum;
  status: string;
  walletId?: mongoose.Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TransactionSchema = new mongoose.Schema<ITransaction>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(TransactionTypeEnum),
    },
    walletId: { type: mongoose.Schema.Types.ObjectId, ref: "Wallet" },
    status: {
      type: String,
      required: true,
      enum: Object.values(TransactionStatusEnum),
      default: TransactionStatusEnum.PENDING,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
