import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
//router files
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

//Connect to MongoDB
connectDB();

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());

//Mount the router
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);


//when client need the PAYPAL_CLIENT_ID they can make a api calll to this route and get it.
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

//Error Handeling middleware
app.use(notFound);
app.use(errorHandler);





app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
});