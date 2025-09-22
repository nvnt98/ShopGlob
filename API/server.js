import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'express';
import userRouter from './Routes/user.js';
import productRouter from './Routes/product.js';
import cartRouter from './Routes/cart.js';
import addressRouter from './Routes/address.js';
import cors from 'cors';
import paymentRouter from './Routes/payment.js';




const app = express();


app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
  origin : true,
  methods : ['GET', 'POST', 'PUT', 'DELETE'],
  credentials : true

}));
 


// home route testing
app.get('/', (req, res) => {
    res.send('home route');
});


// User router
app.use('/api/user', userRouter);

// Product router
app.use('/api/product', productRouter);


// Cart router
app.use('/api/cart', cartRouter);


// Address router
app.use('/api/address', addressRouter);


// Payment router
app.use('/api/payment', paymentRouter);







mongoose.connect('mongodb+srv://nvnt_t:shopglob@shopglob.kavjjv0.mongodb.net/', {
    dbName: 'shopglob'
}
).then(() => console.log('DB connected'))
  .catch((err) => console.log('DB connection error:', err));



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});