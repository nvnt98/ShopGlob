import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRouter from './Routes/user.js';
import productRouter from './Routes/product.js';
import cartRouter from './Routes/cart.js';
import addressRouter from './Routes/address.js';
import paymentRouter from './Routes/payment.js';

// Load environment variables
dotenv.config();

const app = express();

// --- CORS Setup (FIXED) ---
const allowedOrigins = [
  'https://shop-glob.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Auth'],
  credentials: true,
}));

// --- Middleware ---
app.use(express.json());

// --- Routes ---
app.get('/', (req, res) => {
  res.json({ 
    message: 'ShopGlob API is running!',
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/payment', paymentRouter);

// --- 404 Handler ---
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Route not found', 
    success: false 
  });
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ 
    message: err.message || 'Internal Server Error', 
    success: false 
  });
});

// --- Database Connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nvnt_t:shopglob@shopglob.kavjjv0.mongodb.net/';

mongoose.connect(MONGO_URI, {
  dbName: 'shopglob',
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// --- Start Server ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});