import express from "express";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/addProduct", productRoutes);

export default app;
