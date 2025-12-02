import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './Routes/user.js';
import productRouter from './Routes/product.js';
import cartRouter from './Routes/cart.js';
import addressRouter from './Routes/address.js';
import paymentRouter from './Routes/payment.js';

const app = express();

// --- Middleware Setup ---
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// --- Health Check ---
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    server: 'running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// --- Routes ---
app.get('/', (req, res) => {
  res.send('home route');
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/payment', paymentRouter);

// --- Database Connection with Retry ---
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'shopglob',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ DB connection error:', err.message);
    
    if (retries > 0) {
      console.log(`⏳ Retrying connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return connectDB(retries - 1);
    }
    
    console.error('💀 Failed to connect to DB after retries');
    process.exit(1);
  }
};

// --- Start Server ---
const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

// --- Graceful Shutdown ---
process.on('SIGTERM', async () => {
  console.log('⚠️ SIGTERM received, closing server...');
  await mongoose.connection.close();
  process.exit(0);
});