import { createCategoryService } from "../services/categoryService.js";
import { getAllCategoriesService } from "../services/categoryService.js";
import { updateCategoryById } from "../models/categoryModel.js";
export const createCategoryController = async (
  req,
  res,
  next
) => {
  try {
    const category = await createCategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
export const getAllCategoriesController = async (
  req,
  res,
  next
) => {
  try {
    const categories =
      await getAllCategoriesService();

    return res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (
  req,
  res,
  next
) => {
  try {
    const category = await updateCategoryService(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};