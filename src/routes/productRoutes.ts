import { Router } from "express";

import { getProducts } from "../controllers/productController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/",authenticate, getProducts);

export default router;
