import { Request, Response } from "express";
import fetch from "node-fetch";

export const getProducts = async (req: Request, res: Response) => {
  try {
      const restApiProducts = await fetch("https://dummyjson.com/products");
      const data = await restApiProducts.json();
      res.json(data)
    
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error fetching products" });
  }
};


// controllers → Business logic for each route.
// Example: productController.ts contains the function getProducts that fetches products and sends them back to the client. It’s where you decide what happens when /products is called.