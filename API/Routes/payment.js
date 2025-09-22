import express from 'express';
import { checkout,verifyPayment,userOrder,allOrders } from '../Controllers/payment.js';
import {Authenticated} from '../Middleware/auth.js';

const router = express.Router();


// checkout route
router.post('/checkout', checkout);  //--/api/payment/checkout


// verify payment route
router.post('/verify-payment', verifyPayment);  //--/api/payment/verify


// user order route
router.get('/userorder', Authenticated, userOrder);  //--/api/payment/user-orders/:userId

//  All orders route
router.get('/orders', allOrders);  //--/api/payment/orders
export default router;

