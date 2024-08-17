import { Router } from "express";

import {
  addBook,
  deleteBook,
  getBookById,
  searchBook,
  getReservationHistory,
} from "../controllers";
import {
  validateDto,
  validateQueryDto,
} from "../middlewares/validations.middleware";
import { CreateBookDto, DeleteBookDto } from "../dto/book.dto";
import { IBookService } from "../services/interfaces";
import { createBookService } from "../services/factory/services.factory";
import { ReservationQueryDto } from "../dto";

const router = Router();

export const bookService: IBookService = createBookService();

router.get(
  "/reservation-history",
  validateQueryDto(ReservationQueryDto),
  getReservationHistory(bookService),
);

router.get("/search", searchBook(bookService));

router.get("/:id", getBookById(bookService));

router.post("/", validateDto(CreateBookDto), addBook(bookService));

router.delete("/:id", validateDto(DeleteBookDto), deleteBook(bookService));
export default router;
