
import { calculateTotalIncome, calculateTotalExpenses, calculateRemainingBalance } from '../utilities/summary.mjs'

export const getSummary = async (req, res, next) => {
  try {
    const userId = req.auth.id;  

    const totalIncome = await calculateTotalIncome(userId);
    const totalExpenses = await calculateTotalExpenses(userId);
    const remainingBalance = await calculateRemainingBalance(userId);

    res.status(200).json({
      totalIncome,
      totalExpenses,
      remainingBalance,
    });
  } catch (error) {
    next(error);  
  }
};
