import User from "../models/User.js";

// Update User CartData : /api/cart/update

export const updateCart = async (req, res)=>{
    try {
        const userId = req.userId;
        const cartItems = req.body.cartItems || {}
        await User.findByIdAndUpdate( userId, {cartItems}, {returnDocument: 'after'});
        res.json({ success: true, message: "Cart Update" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}