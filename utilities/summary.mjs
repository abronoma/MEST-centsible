import { mongoose, Types } from "mongoose";
import { TransactionModel } from "../models/Transaction.mjs";

// Calculate total income for a user
export const calculateTotalIncome = async (req, res, next) => {
  const incomeTransactions = await TransactionModel.find({
    user: req.auth.id,
    type: "income",
  });

  return incomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);
};

// Calculate total expenses for a user
export const calculateTotalExpenses = async (req, res, next) => {
  const expenseTransactions = await TransactionModel.find({
    user: req.auth.id,
    type: "expense",
  });

  return expenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);
};

// Calculate remaining balance (Income - Expenses)
export const calculateRemainingBalance = async (req, res, next) => {
  const income = await calculateTotalIncome(userId);
  const expenses = await calculateTotalExpenses(userId);
  return income - expenses;
};

//simplied category in pie chart
export const getCategoryChartData = async (req, res, next) => {
  try {
    const userId = req.auth.id;
    const userObjectId = new Types.ObjectId(userId);
    console.log(userObjectId);

    // Step 1: Get total income
    const incomeResult = await TransactionModel.aggregate([
      { $match: { user: userObjectId, type: "income" } },
      {
        $group: {
          _id: "$category",
          totalIncome: { $sum: "$amount" },
        },
      },
    ]);
    console.log(incomeResult);
    const totalIncome = incomeResult[0]?.totalIncome || 0;

    // Step 2: Get expenses grouped by category
    const expenseByCategory = await TransactionModel.aggregate([
      { $match: { user: userObjectId, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
        },
      },
    ]);
    console.log(expenseByCategory);

    // Step 3: Calculate percentage based on total income
    const result = expenseByCategory.map((item) => ({
      category: item.id,
      amount: item.total,
      percentage: totalIncome
        ? ((item.total / totalIncome) * 100).toFixed(2)
        : "0.00",
    }));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//simplified expense chart for the month
export const getMonthlyChartData = async (req, res, next) => {
  try {
    const data = await TransactionModel.aggregate([
      { $match: { user: req.auth.id } },
      {
        $group: {
          _id: { month: { $month: "$date" }, type: "$type" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const income = Array(12).fill(0);
    const expenses = Array(12).fill(0);

    data.forEach(({ _id, total }) => {
      const i = _id.month - 1;
      _id.type === "income" ? (income[i] = total) : (expenses[i] = total);
    });

    res.status(200).json({ labels: months, income, expenses });
  } catch (error) {
    next(error);
  }
};
