import dotenv from "dotenv";
dotenv.config();
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import userRouter from './routes/userRouter.js';
import sellerRouter from './routes/sellerRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import addressRouter from './routes/addressRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

 app.set("trust proxy", 1);

 // Middleware configuration
 app.use(express.json()); 
 app.use(cookieParser());

 app.use(cors({
    origin:
        "https://greencart-frontend-0thz.onrender.com/",
    credentials: true
}));

await connectDB()
await connectCloudinary()

const port = process.env.PORT || 4000;


 app.get('/', (req, res) => res.send(" API is Working"));
 app.use('/api/user', userRouter)
 app.use('/api/seller', sellerRouter)
 app.use('/api/product', productRouter)
 app.use('/api/cart', cartRouter)
 app.use('/api/address', addressRouter)
 app.use('/api/order', orderRouter)
 
 
app.listen(port, ()=>{
         console.log(`Server is running on http://localhost:${port}`);
})

