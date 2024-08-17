import {
  IBorrowedBook,
  IWallet,
  TransactionStatusEnum,
  TransactionTypeEnum,
} from "../models";
import { transactionService } from "../routes/transaction.routes";
import cron from "node-cron";
import { reminderService } from "../services";
import logger from "../utils/logger";

cron.schedule("0 0 * * *", async () => {
  try {
    const data: Partial<IWallet[]> =
      await reminderService.getUsersWithDueBooks();

    logger.info("Fetched data:", data);

    if (data.length === 0) {
      logger.info("No users with due books found.");
      return;
    }

    await Promise.all(
      data.map(async (i) => {
        try {
          logger.info("Processing user:", i);

          const borrowedBook = i.borrowedBooks as unknown as IBorrowedBook;

          if (borrowedBook) {
            logger.info("Borrowed book:", borrowedBook);

            await transactionService.makeTransaction(
              {
                userId: i.user._id as string,
                type: TransactionTypeEnum.LATE_FEE,
                status: TransactionStatusEnum.SUCCESS,
                walletId: i._id as string,
              },
              borrowedBook.bookId as string,
            );

            logger.info(
              `Transaction for user ${i.user._id} created successfully.`,
            );
          } else {
            logger.info("No borrowed books found for user:", i.user._id);
          }
        } catch (err) {
          logger.error(`Error processing user ${i.user._id}:`, err);
        }
      }),
    );

    logger.info("Late fee cron job completed successfully");
  } catch (err) {
    logger.error("Error running late fee cron job:", err);
  }
});
