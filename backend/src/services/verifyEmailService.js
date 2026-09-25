import crypto from "node:crypto";

import {
  findVerificationTokenByHash,
  markVerificationTokenAsUsed,
} from "../models/emailVerificationTokenModel.js";

import { verifyUserEmail } from "../models/userModel.js";

export const verifyEmailService = async (token) => {
  if (!token) {
    const error = new Error("Verification token is required");
    error.statusCode = 400;
    throw error;
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const verificationToken =
    await findVerificationTokenByHash(tokenHash);

  if (!verificationToken) {
    const error = new Error("Invalid verification token");
    error.statusCode = 400;
    throw error;
  }

  if (verificationToken.used_at) {
    const error = new Error("Verification token has already been used");
    error.statusCode = 409;
    throw error;
  }

  const isExpired =
    new Date(verificationToken.expires_at) < new Date();

  if (isExpired) {
    const error = new Error("Verification token has expired");
    error.statusCode = 410;
    throw error;
  }

  const affectedRows = await verifyUserEmail(
    verificationToken.user_id
  );

  if (affectedRows === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await markVerificationTokenAsUsed(
    verificationToken.id
  );

  return {
    message: "Email verified successfully",
  };
};