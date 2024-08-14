import {
  MongooseError,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { BookRepository } from "../repositories/book.repository";
import AppError from "../utils/AppError";
import logger from "../utils/logger";
import { IBook } from "../models/book.model";
import BookOperation, {
  IBookOperation,
  OperationTypeEnum,
} from "../models/BookOperation.model";
import { IBookService } from "./interfaces";

export class BookService implements IBookService {
  constructor(private readonly bookRepository: BookRepository) {}
  async getBookById(id: string): Promise<IBook | null> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    return book;
  }

  async addBook(bookData: Partial<IBook>, isNewBook: boolean): Promise<IBook> {
    const checkBook = await this.bookRepository.find({
      author: bookData.author,
      title: bookData.title,
    });

    if (isNewBook && checkBook.length === 0) {
      const newBook = await this.bookRepository.create(bookData);

      logger.info(
        `New book  added successfully, title: ${bookData.title}, author: ${bookData.author}, quantity: ${bookData.totalQuantity}`,
      );

      return newBook;
    }

    const updatedBook = await this.bookRepository.update(
      { title: bookData.title, author: bookData.author },
      { $inc: { quantity: bookData.totalQuantity } },
    );

    logger.info(
      `New book copy added, title: ${bookData.title}, author: ${bookData.author}, quantity: ${bookData.totalQuantity}`,
    );

    return updatedBook;
  }

  async getBook(query: FilterQuery<IBook>): Promise<IBook[]> {
    return this.bookRepository.find(query);
  }
  async updateBook(id: string, updates: UpdateQuery<IBook>) {
    return this.bookRepository.updateById(id, updates);
  }

  async deleteBook(id: string, deleteQuantity = 1): Promise<IBook> {
    const findBook = await this.bookRepository.findById(id);

    if (!findBook) {
      throw new AppError("Book not found", 404);
    }
    if (findBook.totalQuantity < deleteQuantity) {
      deleteQuantity = findBook.totalQuantity;
    }

    const deletedBook = await this.bookRepository.updateById(id, {
      $inc: { totalQuantity: -deleteQuantity },
    });

    logger.info(
      `Deleted  copy of, title: ${deletedBook.title}, author: ${deletedBook.author}, quantity left: ${deletedBook.totalQuantity}`,
    );

    if (deletedBook.totalQuantity === 0) {
      this.bookRepository.archiveBook({
        author: deletedBook.author,
        title: deletedBook.title,
        publicationYear: deletedBook.publicationYear,
        publisher: deletedBook.publisher,
      });
      logger.info(
        `No copies of, title: ${deletedBook.title}, author: ${deletedBook.author}, moving to archive`,
      );
      return this.bookRepository.delete(id);
    }

    return deletedBook;
  }

  async markBookAsSold(
    bookId: string,
    walletId: string,
    userId: string,
  ): Promise<IBookOperation> {
    await this.deleteBook(bookId);
    return await BookOperation.create({
      bookId,
      operationType: OperationTypeEnum.BUY,
      walletId,
      userId,
    });
  }

  async reserveBook(userId: string, bookId: string): Promise<IBook> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    if (book.availableQuantity === 0) {
      throw new AppError("Book not available", 400);
    }
    return await this.bookRepository.updateById(bookId, {
      $inc: { availableQuantity: -1 },
    });
  }

  async checkBookAvailability(bookId: string): Promise<IBook> {
    const book = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new AppError("Book not found", 404);
    }
    if (book.availableQuantity === 0) {
      throw new AppError("Book not available", 400);
    }

    return book;
  }

  async getReservationHistory(
    after: string,
    before: string,
    filter: FilterQuery<IBookOperation>,
  ): Promise<IBook[]> {
    const parsedBefore = before ? new Date(before) : undefined;
    const parsedAfter = after ? new Date(after) : undefined;

    if (parsedBefore) {
      filter.createdAt = { ...filter.createdAt, $lte: parsedBefore };
    }

    if (parsedAfter) {
      filter.createdAt = { ...filter.createdAt, $gte: parsedAfter };
    }
    return await BookOperation.find(filter);
  }
}
