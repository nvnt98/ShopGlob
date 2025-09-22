import express from "express";
import {
  addToCart,
  clearCart,
  decreaseProductQty,
  getUserCart,
  removeProductFromCart,
  increaseProductQty,
} from "../Controllers/cart.js";

import { Authenticated } from "../Middleware/auth.js";

const router = express.Router();

// add to cart route
router.post("/add", Authenticated, addToCart); //--/api/cart/add)

// get user cart route
router.get("/user", Authenticated, getUserCart); //--/api/cart/get)

// remove product from cart route
router.delete("/remove/:productId", Authenticated, removeProductFromCart); //--/api/cart/remove)

// clear cart route
router.delete("/clear", Authenticated, clearCart); //--/api/cart/clearr

// deacrease product quantity route
router.post("/decrease-qty", Authenticated, decreaseProductQty); //--/api/cart/decrease-qty

// increasse product quantity route
router.post("/increase-qty", Authenticated, increaseProductQty); //--/api/cart/--qty

export default router;
