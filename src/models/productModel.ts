import { pool } from "../config/db";

export const getAllProducts = async () => {
  const result = await pool.query("SELECT * FROM products");
  return result.rows;
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
