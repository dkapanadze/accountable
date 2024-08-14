import { Router } from "express";

import {
  addBook,
  deleteBook,
  getBookById,
  searchBook,
  getReservationHistory,
} from "../controllers";
import { validateDto } from "../middlewares/validations.middleware";
import { CreateBookDto, DeleteBookDto } from "../dto/book.dto";
import { IBookService } from "../services/interfaces";
import { createBookService } from "../services/factory/services.factory";

const router = Router();

export const bookService: IBookService = createBookService();

router.post("/reservation-history", getReservationHistory(bookService));

router.get("/:id", getBookById(bookService));

router.post("/", validateDto(CreateBookDto), addBook(bookService));

router.post("/search", searchBook(bookService));

router.delete("/:id", validateDto(DeleteBookDto), deleteBook(bookService));
export default router;
