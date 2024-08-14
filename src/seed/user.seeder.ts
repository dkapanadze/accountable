import mongoose from "mongoose";
import User, { IUser, RoleEnum, StatusEnum } from "../models/user.model";
import envVars from "../config/validateEnv";
import logger from "../utils/logger";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";

const seedUsers = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    logger.info("Connected to MongoDB");

    const csvFilePath = path.join(__dirname, "../../src/assets/users.csv");

    const users: IUser[] = [];
    await User.deleteMany({});
    logger.info("Existing books cleared");
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on("data", (row) => {
          users.push({
            firstName: row.first_name.length > 2 ? row.first_name : "John",
            lastName: row.last_name,
            status: StatusEnum.ACTIVE,
            email: row.email,
            password: "password",
            role: RoleEnum.USER,
            address: row.address,
            phone: row.phone1,
          } as IUser);
        })
        .on("end", async () => {
          try {
            await User.insertMany(users);
            logger.info("Sample users added successfully");
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  } catch (error) {
    logger.error("Error seeding users:", error);
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
};

seedUsers();
