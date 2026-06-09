import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Razorpay from "razorpay";
import crypto from "crypto";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.userId;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }
        //Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({ success: true, message: "Order Placed Succesfully" })
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


// Place Order Razorpay : /api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
    try {
        const { items, address } = req.body;
        const userId = req.userId;
        const { origin } = req.headers;

        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invalid data" })
        }

        let productData = [];

        //Calculate Amount Using Items
        let amount = 0;
        
        for(const item of items) {
            const product = await Product.findById(item.product);

            if (!product) continue;

            productData.push({
                name: product.name,
                price: product.offerPrice,
                quantity: item.quantity,
            });

            amount += product.offerPrice * item.quantity;
        }
        // Add Tax Charge (2%)
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // Razorpay Gateway Initialize
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        // Create Razorpay order

        const razorpayOrder = await razorpayInstance.orders.create({
            amount: amount * 100,
            
            currency: process.env.RAZORPAY_CURRENCY,
            receipt: order._id.toString(),
            notes: {
                userId: userId,
                orderId: order._id.toString(),
            }
        });

        return res.json({
            success: true,
            order: razorpayOrder,
            key_id: process.env.RAZORPAY_KEY_ID,
            currency: process.env.RAZORPAY_CURRENCY 
        });
    }
    catch (error) {
        console.log(error);
        return res.json({
            success: false,
            message: error.message
        });
    }
};

export const verifyOrderRazorpay = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, orderId } = req.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature || !orderId) {
            return res.json({ success: false, message: "Invalid payment verification data" });
        }

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return res.json({ success: false, message: "Payment verification failed" });
        }

        const updatedOrder = await Order.findOneAndUpdate(
            { _id: orderId, userId: req.userId },
            { isPaid: true, status: "Paid" },
            { new: true }
        );

        if (!updatedOrder) {
            return res.json({ success: false, message: "Order not found or unauthorized" });
        }

        return res.json({ success: true, message: "Payment verified successfully" });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};


// Get Orders by User ID : /api/order/user
export const getUSerOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await Order.find({
            userId,
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

// Get All Orders ( for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [{ paymentType: "COD" }, { isPaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
