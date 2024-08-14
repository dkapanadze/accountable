import { FilterQuery, QueryOptions } from "mongoose";
import { IBook, IBookOperation } from "../../models";
import { UpdateQuery } from "mongoose";

export interface IBookService {
  getBookById(id: string): Promise<IBook | null>;
  addBook(bookData: Partial<IBook>, isNewBook: boolean): Promise<IBook>;
  getBook(query: FilterQuery<IBook>): Promise<IBook[]>;
  updateBook(id: string, updates: UpdateQuery<IBook>): Promise<IBook>;
  deleteBook(id: string, deleteQuantity?: number): Promise<IBook>;
  markBookAsSold(
    bookId: string,
    walletId: string,
    userId: string,
  ): Promise<IBookOperation>;
  reserveBook(userId: string, bookId: string): Promise<IBook>;
  checkBookAvailability(bookId: string): Promise<IBook>;
  getReservationHistory(
    after: string,
    before: string,
    bookId?: QueryOptions<IBookOperation>,
  ): Promise<IBook[]>;
}
