import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import userRouter from "./Routes/user.js";
import productRouter from "./Routes/product.js";
import cartRouter from "./Routes/cart.js";
import addressRouter from "./Routes/address.js";
import paymentRouter from "./Routes/payment.js";

const app = express();

// --- Middleware Setup ---
const allowedOrigin = process.env.FRONTEND_URL || "https://shop-glob.vercel.app";

app.use(
  cors({
    origin: allowedOrigin, // ✅ Explicitly specify your front-end domain
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // ✅ Allow cookies for that origin
    allowedHeaders: ["Content-Type", "Auth"], // custom headers
  })
);

app.use(express.json());

// --- Routes ---
app.get("/", (req, res) => {
  res.send("home route");
});

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use("/api/payment", paymentRouter);

// --- Database and Server Start ---
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://nvnt_t:shopglob@shopglob.kavjjv0.mongodb.net/",
    {
      dbName: "shopglob",
    }
  )
  .then(() => console.log("✅ DB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});