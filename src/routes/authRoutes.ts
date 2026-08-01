import { Router } from "express";
import { signIn, signUp } from "../controllers/authController";

const router = Router();

router.post('/signin', signIn);
router.post('/signup', signUp); 

export default router;


// POST http://localhost:4000/signin

// POST http://localhost:4000/signup