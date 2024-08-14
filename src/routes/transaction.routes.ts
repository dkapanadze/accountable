import { Router } from "express";
import { createTransaction } from "../controllers";
import { validateDto } from "../middlewares/validations.middleware";
import { CreateTransactionDto } from "../dto";
import { reservationMiddleware } from "../middlewares/reservations.middleware";
import {
  createTransactionService,
  createWalletService,
} from "../services/factory/services.factory";
import { ITransactionService, IWalletService } from "../services/interfaces";

export const walletService: IWalletService = createWalletService();

export const transactionService: ITransactionService =
  createTransactionService();
const router = Router();

router.post(
  "/",
  validateDto(CreateTransactionDto),
  reservationMiddleware,
  createTransaction(transactionService),
);

export default router;
