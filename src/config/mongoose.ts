import mongoose from "mongoose";
import envVars from "./validateEnv";

export const connectToMongoDB = async () => {
  try {
    await mongoose.connect(
      envVars.MONGO_URI || "mongodb://localhost:27017/accountable",
    );

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
