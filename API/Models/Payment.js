// File: API/Models/Payment.js
import mongoose from "mongoose";

const paymentScema = new mongoose.Schema(
  {
    orderDate: {
      type: Date,
      default: Date.now,
    },
    payStatus: {
      type: String,
    },
  },
  { strict: false }
);

export default mongoose.model("Payment", paymentScema);