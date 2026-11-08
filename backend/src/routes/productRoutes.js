import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";
import { createProductController } from "../controllers/ProductController.js";
import { getAllProductsController } from "../controllers/ProductController.js";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createProductController
);
router.get("/",getAllProductsController);
export default router;