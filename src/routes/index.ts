import { Router, Request, Response } from "express";
import userRoutes from "./user.routes";
import bookRoutes from "./book.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     summary: Check if the server is running
 *     tags:
 *       - Healthcheck
 *     responses:
 *       200:
 *         description: Server is up and running
 *
 */
router.get("/healthcheck", (req: Request, res: Response) => {
  res.status(200).json({ message: "Server is up and running" });
});
router.use("/users", userRoutes);
router.use("/books", bookRoutes);
router.use("/transactions", transactionRoutes);

export default router;
