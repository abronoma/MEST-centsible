import { TransactionModel } from "../models/Transaction.mjs";
import mongoose from "mongoose";

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.auth.id;
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const limit = parseInt(req.query.limit) || 5;

    // Get the total income
    const incomeResult = await TransactionModel.aggregate([
      { $match: { user: userObjectId, type: "income" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get total expenses
    const expensesResult = await TransactionModel.aggregate([
      { $match: { user: userObjectId, type: "expense" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Get expenses grouped by category
    const expenseByCategory = await TransactionModel.aggregate([
      { $match: { user: userObjectId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get recent transactions
    const recentTransactions = await TransactionModel.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit)
      .select("amount date category description type");

    // Calculate current balance
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpenses =
      expensesResult.length > 0 ? expensesResult[0].total : 0;
    const currentBalance = totalIncome - totalExpenses;

    // Return all dashboard data in a single response
    res.status(200).json({
      summary: {
        totalIncome,
        totalExpenses,
        currentBalance,
      },
      spendingByCategory: expenseByCategory.map((item) => ({
        name: item._id,
        value: parseFloat(
          item.total ? ((item.total / totalExpenses) * 100).toFixed(2) : "0.00"
        ),
        currency: item.total,
        // category: item._id,
        // amount: item.total,
      })),
      recentTransactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dashboard data", error: error.message });
  }
};
