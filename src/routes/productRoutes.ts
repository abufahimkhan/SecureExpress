import { Router } from "express";
import {
  getProducts,
  addProduct,
  getProductById,
} from "../controllers/productController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/:id", authenticate, getProductById);
router.get("/", authenticate, getProducts);
router.post("/", authenticate, addProduct);

export default router;
