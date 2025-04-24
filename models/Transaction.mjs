import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

const transactionSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    currency: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    category: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.Number
    },
  },
  { timestamps: true }
);

transactionSchema.plugin(normalize);
export const TransactionModel = model("Transaction", transactionSchema);
