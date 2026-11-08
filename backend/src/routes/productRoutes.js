import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createProductController } from "../controllers/ProductController.js";
import { getAllProductsController } from "../controllers/ProductController.js";
import { getProductByIdController } from "../controllers/ProductController.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProductController
);
router.get("/",getAllProductsController);
router.get("/:id", getProductByIdController);
export default router;