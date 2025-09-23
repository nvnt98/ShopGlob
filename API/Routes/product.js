// File: API/Routes/product.js
import express from "express";
import { addProduct, deleteProductById, getAllProducts, getProductById, updateProductById } from "../Controllers/product.js";

const router = express.Router();

// add product route
router.post('/add',addProduct);  //--/api/product/add

// get all products route
router.get('/all',getAllProducts);  //--/api/product/all

// get product by id route
router.get('/:id',getProductById);  //--/api/product/:id


// update product by id route
router.put('/:id',updateProductById);  //--/api/product/:id

// delete product by id route
router.delete('/:id',deleteProductById);  //--/api/product/:id

export default router;