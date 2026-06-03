import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUSerOrders, placeOrderCOD} from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';
import Order from "../models/Order.js";
import User from "../models/User.js";
import mongoose from 'mongoose';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUSerOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
 
orderRouter.post("/place", async (req,res)=>{
  try {
  
    const {  items, amount, address } = req.body;
    const userId = new mongoose.Types.ObjectId();
    // Create order in DB
    const order = new Order({
      userId,
      items,        // Array of {product, quantity}
      amount,
      address,
      payment: "Paid",
      paymentType: "Dummy",   // Since it's dummy.
      status: "Processing",
      date: Date.now()
    });

    await order.save();

    // Clear user cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    res.json({
      success:true,
      message:"Payment successful",
      transactionId:"TXN" + Date.now()
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success:false, message:"Server error" });
  }
});

export default orderRouter; 


