import TransactionModel from '../models/Transaction.mjs';
import userModel from '../models/User.mjs';

// Get dashboard summary data
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id; 
    // Get total income
    const incomeResult = await TransactionModel.aggregate([
      { $match: { user: userId, type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Get total expenses
    const expensesResult = await TransactionModel.aggregate([
      { $match: { user: userId, type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Calculate current balance
    const totalIncome = incomeResult.length > 0 ? incomeResult[0].total : 0;
    const totalExpenses = expensesResult.length > 0 ? expensesResult[0].total : 0;
    const currentBalance = totalIncome - totalExpenses;
    
    res.status(200).json({
      totalIncome,
      totalExpenses,
      currentBalance
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard summary', error: error.message });
  }
};

// Get spending by category
export const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const categorySpending = await TransactionModel.aggregate([
      { $match: { user: userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } }
    ]);
    
    res.status(200).json(
      categorySpending.map(item => ({
        category: item._id,
        amount: item.total
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category spending', error: error.message });
  }
};

// Get recent transactions
export const getRecentTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5; // Default to 5 transactions
    
    const recentTransactions = await TransactionModel.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit)
      .select('amount date category description type');
    
    res.status(200).json(recentTransactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent transactions', error: error.message });
  }
};