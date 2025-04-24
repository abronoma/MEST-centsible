import { Router } from "express";
import { isAuthenticated, isAuthorized } from "../middlewares/auth.mjs";
import { getSummary } from "../controllers/summary.mjs";
import { getCategoryChartData, getMonthlyChartData } from "../utilities/summary.mjs";
import { getDashboardData } from "../controllers/dashboard.mjs";


const summaryRouter = Router();


summaryRouter.get('/data', isAuthenticated, isAuthorized, getDashboardData);
summaryRouter.get("/summary/", isAuthenticated, getSummary);
summaryRouter.get('/charts/category', isAuthenticated, getCategoryChartData);
summaryRouter.get('/charts/monthly', isAuthenticated, getMonthlyChartData);



export default summaryRouter;