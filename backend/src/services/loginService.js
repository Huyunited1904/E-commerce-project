import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../models/userModel.js";

export const loginService = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const userAuth = await findUserByEmail(normalizedEmail);

  if (!userAuth) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userAuth.password_hash
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!userAuth.is_email_verified) {
    const error = new Error("Please verify your email before logging in");
    error.statusCode = 403;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: userAuth.id,
      role: userAuth.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );

  return {
    user: {
      id: userAuth.id,
      fullName: userAuth.full_name,
      email: userAuth.email,
    },
    token,
  };
};