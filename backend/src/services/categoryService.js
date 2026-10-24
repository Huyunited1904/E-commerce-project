import {
  createCategory,
  findCategoryByName,
  getAllCategories,
  updateCategoryById,
  findCategoryById,
  deleteCategoryById
} from "../models/categoryModel.js";

let categoriesCache = null;
let categoriesCacheExpiresAt = 0;

const CATEGORY_CACHE_TTL = 60 * 1000;

const clearCategoriesCache = () => {
  categoriesCache = null;
  categoriesCacheExpiresAt = 0;
};

export const createCategoryService = async ({
  name,
  description,
}) => {
  if (!name || typeof name !== "string" || !name.trim()) {
    const error = new Error("Category name is required");
    error.statusCode = 400;
    throw error;
  }

  const normalizedName = name
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleUpperCase("vi-VN");

  const normalizedDescription =
    typeof description === "string" && description.trim()
      ? description.trim()
      : null;

  const existingCategory =
    await findCategoryByName(normalizedName);

  if (existingCategory) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  try {
    const category = await createCategory({
      name: normalizedName,
      description: normalizedDescription,
    });

    clearCategoriesCache();

    return category;
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error(
        "Category already exists"
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};

export const getAllCategoriesService = async () => {
  const now = Date.now();

  if (
    categoriesCache !== null &&
    now < categoriesCacheExpiresAt
  ) {
    return categoriesCache;
  }

  const categories = await getAllCategories();

  categoriesCache = categories;
  categoriesCacheExpiresAt =
    Date.now() + CATEGORY_CACHE_TTL;

  return categories;
};

export const updateCategoryService = async (
  categoryId,
  { name, description }
) => {
  const id = Number(categoryId);

  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const existingCategory = await findCategoryById(id);

  if (!existingCategory) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  let updatedName = existingCategory.name;
  let updatedDescription =
    existingCategory.description;

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      const error = new Error(
        "Category name cannot be empty"
      );
      error.statusCode = 400;
      throw error;
    }

    updatedName = name
      .trim()
      .replace(/\s+/g, " ")
      .toLocaleUpperCase("vi-VN");

    const existingName =
      await findCategoryByName(updatedName);

    if (existingName && existingName.id !== id) {
      const error = new Error(
        "Category already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  if (description !== undefined) {
    updatedDescription =
      typeof description === "string" &&
      description.trim()
        ? description.trim()
        : null;
  }

  try {
    await updateCategoryById({
      id,
      name: updatedName,
      description: updatedDescription,
    });

    clearCategoriesCache();

    return await findCategoryById(id);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      const duplicateError = new Error(
        "Category already exists"
      );
      duplicateError.statusCode = 409;
      throw duplicateError;
    }

    throw error;
  }
};

export const deleteCategoryService = async (id) => {
  const categoryId = Number(id);

  if (!Number.isSafeInteger(categoryId) || categoryId <= 0) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const affectedRows = await deleteCategoryById(categoryId);

  if (affectedRows === 0) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  clearCategoriesCache();

  return {
    message: "Category deleted successfully",
  };
};