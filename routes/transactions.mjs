import { Router } from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.mjs";

import { isAuthenticated } from "../middlewares/auth.mjs";

const transactionRouter = Router();

transactionRouter.post("/transaction", isAuthenticated,  createTransaction);

transactionRouter.get("/transactions",  getAllTransactions);

transactionRouter.get("/transaction/:id", getTransactionById);

transactionRouter.put("/transaction/:id", isAuthenticated, updateTransaction);

transactionRouter.delete(
  "/transaction/:id",
  isAuthenticated,
  deleteTransaction
);


export default transactionRouter;
