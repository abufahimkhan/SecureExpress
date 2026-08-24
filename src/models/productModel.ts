import id from "zod/v4/locales/id.js";
import { pool } from "../config/db";

export const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products");
  return result.rows;
};

export const findProductById = async (id: number) => {
  const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
  return result.rows[0];
};

export const createProduct = async (
  imageUrl: string,
  name: string,
  price: number,
  stock: number,
) => {
  const result = await pool.query(
    "INSERT INTO products (imageUrl, name, price, stock) VALUES ($1, $2, $3, $4) RETURNING *",
    [imageUrl, name, price, stock],
  );
  return result.rows[0];
};
