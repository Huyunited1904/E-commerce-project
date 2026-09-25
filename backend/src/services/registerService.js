import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { createVerificationToken } from "../models/emailVerificationTokenModel.js";
import {
  findUserByEmail,
  createUser,
} from "../models/userModel.js";
import { sendVerificationEmail } from "./emailService.js";
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
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto
  .createHash("sha256")
  .update(token)
  .digest("hex");
  await createVerificationToken({
  userId,
  tokenHash,
  expiresAt,
});
  await sendVerificationEmail({
  email: normalizedEmail,
  fullName,
  token,
});
  return {
    id: userId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    isEmailVerified: false,
  };
};