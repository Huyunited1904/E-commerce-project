import { registerService } from "../services/registerService.js";

export const registerController = async (req, res, next) => {
  try {
    const result = await registerService(req.body);

    return res.status(201).json({
      success: true,
      message: "Register successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};