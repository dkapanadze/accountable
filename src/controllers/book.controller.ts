import { Request, Response } from "express";
import { IBook } from "../models/book.model";
import { handleAsyncErrors } from "../utils/errorHandler";
import AppError from "../utils/AppError";
import { IBookService } from "../services/interfaces";
import { isValidObjectId } from "../utils/validateObjectId";

export const getBookById = (bookService: IBookService) =>
  handleAsyncErrors(async (req: Request, res: Response) => {
    const bookId = req.params.id;

    isValidObjectId(bookId);

    const book = await bookService.getBookById(bookId);

    res.status(200).json({ book });
  });

export const addBook = (bookService: IBookService) =>
  handleAsyncErrors(async (req: Request, res: Response) => {
    const { isNewBook, ...input } = req.body;
    const newBook = await bookService.addBook(input, isNewBook);
    res.status(201).json({ newBook });
  });

export const searchBook = (bookService: IBookService) =>
  handleAsyncErrors(async (req: Request, res: Response) => {
    const query = req.query;

    const foundBooks: IBook[] = await bookService.getBook(query);

    if (foundBooks.length === 0) {
      throw new AppError("No books found", 404);
    }

    res.status(200).json({ foundBooks });
  });

export const deleteBook = (bookService: IBookService) =>
  handleAsyncErrors(async (req: Request, res: Response) => {
    const id = req.params.id;

    isValidObjectId(id);

    const { quantity } = req.body ?? {};

    const { totalQuantity: quantityLeft } = await bookService.deleteBook(
      id,
      quantity,
    );

    res
      .status(200)
      .json({ message: "Book deleted successfully", quantityLeft });
  });

export const getReservationHistory = (bookService: IBookService) =>
  handleAsyncErrors(async (req: Request, res: Response) => {
    const { before, after, ...query } = req.body;

    const reservationHistory = await bookService.getReservationHistory(
      after,
      before,
      query,
    );
    res.status(200).json({ reservationHistory });
  });
