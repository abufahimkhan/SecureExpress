import { Router } from "express";
import { getProducts, addProduct } from "../controllers/productController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authenticate, getProducts);
router.post("/", authenticate, addProduct);

export default router;
