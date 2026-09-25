import { verifyEmailService } from "../services/verifyEmailService.js";
import { errorMiddleware } from "../middlewares/errorMiddleware.js";
export const verifyEmailController = async (req, res, next) => {
  try {
    const { token } = req.body;

    const result = await verifyEmailService(token);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};