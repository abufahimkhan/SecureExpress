import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/userModel";
import { v4 as uuidv4 } from "uuid";

const users: UserModel[] = []; // In-memory user storage for demonstration purposes

export const signUp = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const existingUser = users.find((u) => u.email === email);

  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ id: uuidv4(), email, password: hashedPassword });
  return res.status(201).json({
    message: "User created successfully",
  });
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userExistence = users.find((u) => u.email === email);

  if (!userExistence) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const hashPassMatching = await bcrypt.compare(
    password,
    userExistence.password,
  );

  if (!hashPassMatching) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const jwtToken = jwt.sign(
    {
      id: userExistence.id,
      email: userExistence.email
    },
    process.env.JWT_SECRET!,
    { expiresIn: "1h" },
  );

  res.json({ token: jwtToken });
};
