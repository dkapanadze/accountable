import mongoose from "mongoose";
import AppError from "./AppError";

export const isValidObjectId = (id: string): void => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid  ID format", 400);
  }
};
