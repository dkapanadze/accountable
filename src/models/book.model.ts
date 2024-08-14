import mongoose, { Schema, Document } from "mongoose";

export interface IBook extends Document {
  id: mongoose.Types.ObjectId;
  title: string;
  author: string;
  publicationYear: number;
  price: number;
  availableQuantity: number;
  totalQuantity: number;
  publisher: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const BookSchema: Schema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    availableQuantity: {
      type: Number,
      required: true,
      default: 4,
      min: [0, "Quantity must be at least 0"],
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 4,
      min: [0, "Quantity must be at least 0"],
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model<IBook>("Book", BookSchema);

export type IArchivedBook = Omit<IBook, "quantity" | "price">;

const ArchivedBookSchema: Schema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const ArchivedBook = mongoose.model<IArchivedBook>(
  "ArchivedBook",
  ArchivedBookSchema,
);

export default Book;
