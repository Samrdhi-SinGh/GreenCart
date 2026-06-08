import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUSerOrders, placeOrderCOD, placeOrderRazorpay} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';


const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUSerOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

export default orderRouter; 


