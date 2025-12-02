import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import userRouter from './Routes/user.js';
import productRouter from './Routes/product.js';
import cartRouter from './Routes/cart.js';
import addressRouter from './Routes/address.js';
import paymentRouter from './Routes/payment.js';

const app = express();

// ===========================================
// MIDDLEWARE
// ===========================================

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://shop-glob.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());

// ===========================================
// ROUTES
// ===========================================

app.get('/', (req, res) => {
  res.json({ 
    message: 'ShopGlob API is running',
    status: 'OK' 
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/payment', paymentRouter);

// ===========================================
// 404 HANDLER
// ===========================================

app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

// ===========================================
// ERROR HANDLER
// ===========================================

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

// ===========================================
// DATABASE CONNECTION
// ===========================================

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`🚀 Server running at http://localhost:${PORT}`);
});