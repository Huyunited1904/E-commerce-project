import { createProductService } from "../services/ProductService.js";
import { getAllProductsService } from "../services/ProductService.js";
import { getProductByIdService } from "../services/ProductService.js";
export const createProductController = async (req, res, next) => {
  try {
    const product = await createProductService(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsController = async (req, res, next) => {
  try {
    const products = await getAllProductsService({
      page: req.query.page,
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdController = async (req, res, next) => {
  try {
    const product = await getProductByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};