import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";

export const registerService = async ({ fullName, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await findUserByEmail(normalizedEmail);

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = 409;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const userId = await createUser({
    fullName: fullName.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return {
    id: userId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    isEmailVerified: false,
  };
};