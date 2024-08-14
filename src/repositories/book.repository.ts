import { FilterQuery, UpdateQuery } from "mongoose";
import Book, { ArchivedBook, IArchivedBook, IBook } from "../models/book.model";

export class BookRepository {
  async findById(id: string): Promise<IBook | null> {
    return Book.findById(id).exec();
  }

  async create(book: Partial<IBook>): Promise<IBook> {
    return Book.create(book);
  }

  async updateById(
    id: string,
    updates: UpdateQuery<IBook>,
  ): Promise<IBook | null> {
    return Book.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async update(
    filter: FilterQuery<IBook>,
    updates: UpdateQuery<IBook>,
  ): Promise<IBook | null> {
    return Book.findOneAndUpdate(filter, updates, { new: true }).exec();
  }

  async find(filter: FilterQuery<IBook>): Promise<IBook[]> {
    const query: FilterQuery<IBook> = Object.entries(filter).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = { $regex: new RegExp(value as string, "i") };
        }
        return acc;
      },
      {} as FilterQuery<IBook>,
    );
    return Book.find(query).exec();
  }

  async delete(id: string): Promise<IBook | null> {
    return Book.findByIdAndDelete(id).exec();
  }

  async archiveBook(
    book: Partial<IArchivedBook>,
  ): Promise<IArchivedBook | null> {
    return ArchivedBook.create(book);
  }
}
