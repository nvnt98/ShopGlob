// api/controllers/product.js
import { Product } from "../Models/Product.js";

// ==========================
// Add Product
// ==========================
export const addProduct = async (req, res) => {
  const { title, description, price, category, qty, imgSrc } = req.body;

  try {
    const product = new Product({
      title,
      description,
      price,
      category,
      qty,
      imgSrc,
    });

    await product.save();

    res.json({
      message: "Product added successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// ==========================
// Get All Products
// ==========================
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ message: "All products", products, success: true });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// ==========================
// Get Product By ID
// ==========================
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.json({ message: "Product not found", success: false });
    }

    res.json({
      message: "Specific product found",
      product,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// ==========================
// Update Product By ID
// ==========================
export const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document instead of old one
      runValidators: true, // run schema validations
    });

    if (!product) {
      return res.json({ message: "Product not found", success: false });
    }

    res.json({
      message: "Product updated successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// ==========================
// Delete Product By ID
// ==========================
export const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.json({ message: "Product not found", success: false });
    }

    res.json({
      message: "Product deleted successfully",
      product,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};