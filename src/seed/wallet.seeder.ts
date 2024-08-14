import mongoose from "mongoose";
import { CurrencyEnum, IWallet } from "../models";
import User from "../models/user.model";
import envVars from "../config/validateEnv";
import Wallet, { WalletStatusEnum } from "../models/wallet.model";
import logger from "../utils/logger";

export const seedWallets = async () => {
  await mongoose.connect(envVars.MONGO_URI);

  logger.info("Connected to MongoDB");

  Wallet.deleteMany({});

  logger.info("Existing wallets cleared");

  const userIds = await User.find().select("_id");

  const wallets: Partial<IWallet>[] = [];

  userIds.forEach((userId) => {
    const objectId = new mongoose.Types.ObjectId(userId._id as string);
    const balance = getRandomNumber(100, 250);
    wallets.push({
      userId: objectId,
      balance: balance,
      currency: CurrencyEnum.EUR,
      status: WalletStatusEnum.ACTIVE,
      name: "Wallet",
      borrowedBooks: [],
    });
  });

  try {
    await Wallet.insertMany(wallets);
    logger.info("Sample wallets seeded successfully");
  } catch (error) {
    logger.error("Error seeding wallets:", error);
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
};

function getRandomNumber(min: number = 100, max: number = 250): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

seedWallets();
