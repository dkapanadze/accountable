import mongoose from "mongoose";

export interface IBookOperation {
  id: string;
  userId: mongoose.Schema.Types.ObjectId | string;
  bookId: mongoose.Schema.Types.ObjectId | string;
  operationType: string;
  walletId: mongoose.Schema.Types.ObjectId | string;
  createdAt?: Date;
}

export enum OperationTypeEnum {
  RESERVATION = "RESERVATION",
  BUY = "BUY",
  RETURN = "RETURN",
}
const BookOperationSchema = new mongoose.Schema<IBookOperation>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    operationType: {
      type: String,
      required: true,
      enum: Object.values(OperationTypeEnum),
    },
  },
  { timestamps: true },
);

const BookOperation = mongoose.model<IBookOperation>(
  "BookOperation",
  BookOperationSchema,
);
export default BookOperation;
