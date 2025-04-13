import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.mjs";
import { getSummary } from "../controllers/summary.mjs";
import { getCategoryChartData, getMonthlyChartData } from "../utilities/summary.mjs";


const summaryRouter = Router();



summaryRouter.get("/summary/", isAuthenticated, getSummary);
summaryRouter.get('/charts/category', isAuthenticated, getCategoryChartData);
summaryRouter.get('/charts/monthly', isAuthenticated, getMonthlyChartData);



export default summaryRouter;