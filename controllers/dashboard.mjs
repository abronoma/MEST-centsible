import { TransactionModel } from '../models/Transaction.mjs';
//import { userModel } from '../models/User.mjs';

export const getDashboardData = async (req, res) => {
    try {
      const userId = req.auth.id; 
      const limit = parseInt(req.query.limit) || 5; 
      //Get the total income
      const incomeResult = await TransactionModel.aggregate([
        { $match: { user: userId, type: 'income' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      // Get total expenses
      const expensesResult = await TransactionModel.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      // Get spending by category
      const categorySpending = await TransactionModel.aggregate([
        { $match: { user: userId, type: 'expense' } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
      ]);
      
      // Get recent transactions
      const recentTransactions = await TransactionModel.find({ user: userId })
        .sort({ date: -1 })
        .limit(limit)
        .select('amount date category description type');
      
      // Calculate current balance
      const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
      const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;
      const currentBalance = totalIncome - totalExpenses;
      
      // Return all dashboard data in a single response
      res.status(200).json({
        summary: {
          totalIncome,
          totalExpenses,
          currentBalance
        },
        spendingByCategory: categorySpending.map(item => ({
          category: item._id,
          amount: item.total
        })),
        recentTransactions
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
    }
  };