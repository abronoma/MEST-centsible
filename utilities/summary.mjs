import { TransactionModel } from "../models/Transaction.mjs";
// Calculate total income for a user
export const calculateTotalIncome = async (userId) => {
    const incomeTransactions = await TransactionModel.find({
      user: userId,
      type: 'income',
    });
  
    return incomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  };
  
  // Calculate total expenses for a user
  export const calculateTotalExpenses = async (userId) => {
    const expenseTransactions = await TransactionModel.find({
      user: userId,
      type: 'expense',
    });
  
    return expenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  };
  
  // Calculate remaining balance (Income - Expenses)
  export const calculateRemainingBalance = async (userId) => {
    const income = await calculateTotalIncome(userId);
    const expenses = await calculateTotalExpenses(userId);
    return income - expenses;
  };
  


  //simplied category in pie chart
  export const getCategoryChartData = async (req, res, next) => {
    try {
      const data = await TransactionModel.aggregate([
        { $match: { user: req.auth.id, type: 'expense' } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $project: { _id: 0, label: '$_id', value: '$total' } }
      ]);
      res.status(200).json(data);
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
            _id: { month: { $month: '$date' }, type: '$type' },
            total: { $sum: '$amount' }
          }
        }
      ]);
  
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const income = Array(12).fill(0);
      const expenses = Array(12).fill(0);
  
      data.forEach(({ _id, total }) => {
        const i = _id.month - 1;
        _id.type === 'income' ? income[i] = total : expenses[i] = total;
      });
  
      res.status(200).json({ labels: months, income, expenses });
    } catch (error) {
      next(error);
    }
  };
  