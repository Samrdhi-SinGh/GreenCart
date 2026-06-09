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
const port = process.env.PORT || 4000;
  
await connectDB()
await connectCloudinary()


 // Allow multiple origins
 //const allowedOrigins= ['http://localhost:5173']

 app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  'https://greencart-frontend-0thz.onrender.com',
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy does not allow access from origin ${origin}`));
  },
  credentials: true,
};

 // Middleware configuration
//  app.use(express.json()); 
//  app.use(cookieParser());
//  app.use(cors({origin: allowedOrigins, credentials: true}));

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

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
