import mongoose from "mongoose";
import envVars from "../config/validateEnv";
import logger from "../utils/logger";
import Book, { IBook } from "../models/book.model";
import path from "path";
import fs from "fs";
import csvParser from "csv-parser";

const seedUsers = async () => {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    logger.info("Connected to MongoDB");

    const csvFilePath = path.join(__dirname, "../../src/assets/books.csv");

    const books: IBook[] = [];
    await Book.deleteMany({});
    logger.info("Existing books cleared");
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on("data", (row) => {
          books.push({
            title: row.title,
            author: row.author,
            publicationYear: row.publication_year,
            price: row.price,
            publisher: row.publisher,
          } as IBook);
        })
        .on("end", async () => {
          try {
            await Book.insertMany(books);
            logger.info("Sample books added successfully");

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
    logger.error("Error seeding books:", error);
  } finally {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
  }
};

seedUsers();
