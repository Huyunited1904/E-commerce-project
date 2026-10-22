import express from "express";
import {
  createCategoryController,
  getAllCategoriesController,
  updateCategoryController
} from "../controllers/categoryController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/",authMiddleware,adminMiddleware,createCategoryController);
router.get("/", getAllCategoriesController);
router.patch(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategoryController
);
export default router;