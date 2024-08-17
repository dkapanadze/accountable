import mongoose from "mongoose";
import envVars from "./validateEnv";
import logger from "../utils/logger";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      envVars.MONGO_URI || "mongodb://localhost:27017/accountable",
    );

    logger.info("Connected to MongoDB");
  } catch (error) {
    logger.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
