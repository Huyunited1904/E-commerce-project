import { profileService } from "../services/profileService.js";

export const profileController = async (req, res, next) => {
  try {
    const user = await profileService(req.userId);

    return res.status(200).json({
      success: true,
      message: "Get profile successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};