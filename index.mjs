import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import userRouter from "./routes/auth.mjs";
import transactionRouter from "./routes/transactions.mjs";
import summaryRouter from "./routes/summary.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", userRouter);
app.use("/api/v1", transactionRouter);
app.use("/api/v1", summaryRouter);

await mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Centsible Database"))
  .catch((err) => console.error("could not connect to MongoDB", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
