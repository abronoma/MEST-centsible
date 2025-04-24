import { Router } from "express";
import {
  createTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactions.mjs";

import { isAuthenticated, isAuthorized } from "../middlewares/auth.mjs";

const transactionRouter = Router();

transactionRouter.post("/transaction", isAuthenticated,  createTransaction);

transactionRouter.get("/transactions", isAuthenticated, isAuthorized, getAllTransactions);

transactionRouter.get("/transaction/:id", isAuthenticated, isAuthorized, getTransactionById);

transactionRouter.put("/transaction/:id", isAuthenticated, updateTransaction);

transactionRouter.delete(
  "/transaction/:id",
  isAuthenticated,
  deleteTransaction
);


export default transactionRouter;
