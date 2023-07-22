import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";


// @desc    Get All Products
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.status(200).json(products);
});

// @dec     Get Single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if(product) {
    return res.status(200).json(product);
  }

  res.status(404);
  throw new Error(`product Not  found for id ${req.params.id}.`);
});