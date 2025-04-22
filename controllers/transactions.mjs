import { TransactionModel } from "../models/Transaction.mjs";
import { transactionValidator } from "../validators/transaction.mjs";

// Create a new transaction
export const createTransaction = async (req, res, next) => {
  try {
    console.log("User in request:", req.user);
    const { error, value } = transactionValidator.validate(req.body);
    if (error) return res.status(422).json(error);

    const newTransaction = await TransactionModel.create({
      ...value,
      user: req.auth.id
    });
    return res.status(201).json({
      message: "Transaction created successfully",
      data: newTransaction,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTransactions = async (req, res, next) => {
  try {
    const { filter = "{}", sort = '{"date": -1}', limit = 10 } = req.query;

    const transactions = await TransactionModel.find({
      user: userId,
      ...JSON.parse(filter),
    })
      .sort(JSON.parse(sort))
      .limit(parseInt(limit));

    res.status(200).json(transactions);
  } catch (error) {
    next(error);
  }
};



// Get a single transaction by ID
export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await TransactionModel.findOne({
      _id: req.params.id,
      user: req.auth.id,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    res.status(200).json(transaction);
  } catch (error) {
    next(error);
  }
};

// Update a transaction
export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await TransactionModel.findOneAndUpdate(
      { _id: req.params.id, user: req.auth.id },
      req.body,
      { new: true }
    );

    if (!transaction)
      return res
        .status(404)
        .json({ message: "Transaction not found or not yours" });

    res.status(200).json({
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res, next) => {
  try {
    const deleted = await TransactionModel.findOneAndDelete({
      _id: req.params.id,
      user: req.auth.id,
    });

    if (!deleted)
      return res
        .status(404)
        .json({ message: "Transaction not found or not yours" });

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    next(error);
  }
};
