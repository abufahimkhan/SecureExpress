import { Request, Response } from "express";
import fetch from "node-fetch";
import { getAllProducts, createProduct } from "../models/productModel";

export const getProducts = async (req: Request, res: Response) => {
  try {
    //   const restApiProducts = await fetch("https://dummyjson.com/products");
      const products = await getAllProducts();
    //   const data = await restApiProducts.json();
      res.json(products)
    
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
  }
};

export const addProduct = async (req: Request, res: Response) => {
  const { imageUrl, name, price, stock } = req.body;
  try {
    const newProduct = await createProduct(imageUrl, name, price, stock);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error adding product" });
  }
};


// controllers → Business logic for each route.
// Example: productController.ts contains the function getProducts that fetches products and sends them back to the client. It’s where you decide what happens when /products is called.