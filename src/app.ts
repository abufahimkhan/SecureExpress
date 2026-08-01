import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);

export default app;
