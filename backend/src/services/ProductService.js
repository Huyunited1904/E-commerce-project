import { createProduct } from "../models/productModel.js";
import { findCategoryById } from "../models/categoryModel.js";
import { getAllProducts }
 from "../models/productModel.js";

export const createProductService = async ({
  categoryId,
  name,
  description,
  price,
  stock = 0,
  imageUrl,
}) => {
  if (typeof name !== "string" || !name.trim()) {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  if (
    typeof price !== "number" ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    const error = new Error("Price must be a non-negative number");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(stock) || stock < 0) {
    const error = new Error("Stock must be a non-negative integer");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  if (
    description !== undefined &&
    description !== null &&
    typeof description !== "string"
  ) {
    const error = new Error("Description must be a string");
    error.statusCode = 400;
    throw error;
  }

  if (
    imageUrl !== undefined &&
    imageUrl !== null &&
    typeof imageUrl !== "string"
  ) {
    const error = new Error("Image URL must be a string");
    error.statusCode = 400;
    throw error;
  }

  const normalizedName = name.trim().replace(/\s+/g, " ");
  const normalizedDescription = description?.trim() || null;
  const normalizedImageUrl = imageUrl?.trim() || null;

  if (normalizedName.length > 255) {
    const error = new Error("Product name is too long");
    error.statusCode = 400;
    throw error;
  }

  if (normalizedImageUrl && normalizedImageUrl.length > 2048) {
    const error = new Error("Image URL is too long");
    error.statusCode = 400;
    throw error;
  }

  const category = await findCategoryById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  const productId = await createProduct({
    categoryId,
    name: normalizedName,
    description: normalizedDescription,
    price,
    stock,
    imageUrl: normalizedImageUrl,
  });

  return {
    id: productId,
    categoryId,
    name: normalizedName,
    description: normalizedDescription,
    price,
    stock,
    imageUrl: normalizedImageUrl,
  };
};

export const getAllProductsService = async ({ page = "1" } = {}) => {
  if (typeof page !== "string" || !/^[1-9]\d*$/.test(page)) {
    const error = new Error("Page must be a positive integer");
    error.statusCode = 400;
    throw error;
  }

  const pageNumber = Number(page);
  const limit = 10;
  const offset = (pageNumber - 1) * limit;

  if (
    !Number.isSafeInteger(pageNumber) ||
    !Number.isSafeInteger(offset)
  ) {
    const error = new Error("Page is too large");
    error.statusCode = 400;
    throw error;
  }

  const products = await getAllProducts({ limit, offset });

  return products;
};