import { Request, Response } from "express";

import { handleAsyncErrors } from "../utils/errorHandler";
import { ITransactionService } from "../services/interfaces";

export const createTransaction = (transactionService: ITransactionService) =>
  handleAsyncErrors(async (req: Request, res: Response) => {
    const { bookId, ...transaction } = req.body;

    await transactionService.makeTransaction(transaction, bookId);

    res.status(201).json({ message: "transaction created successfully" });
  });
