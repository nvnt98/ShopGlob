// --API/Controller/cart.js
import { Cart } from "../Models/Cart.js";

// Add to cart
export const addToCart = async (req, res) => {
  const userId = req.user; // temporary user id

  const { productId, title, price, qty, imgSrc } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // If cart doesn't exist, create a new one
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    // If item already exists in the cart, update the quantity
    cart.items[itemIndex].qty += qty;
    cart.items[itemIndex].price += price * qty; // Update price if needed
  } else {
    cart.items.push({
      productId,
      title,
      price,
      qty,
      imgSrc,
    });
  }

  await cart.save();
  res.json({ message: "Item added to cart", cart, success: true });
};

// get user cart
export const getUserCart = async (req, res) => {
  const userId = req.user; // temporary user id
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.json({ message: "Cart is empty" });
  }
  res.json({ message: "User cart", cart, success: true });
};
// remove product from cart
export const removeProductFromCart = async (req, res) => {
  const userId = req.user; // temporary user id
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    return res.json({ message: "Cart not found empty or empty" });
  }
  cart.items = cart.items.filter(
    (item) => item && item.productId.toString() !== req.body.productId
  );
  await cart.save();
  res.json({ message: "Product removed from cart", cart, success: true });
};

// decrease product quantity in cart

export const decreaseProductQty = async (req, res) => {
  const userId = req.user; // temporary user id

  const { productId, qty} = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    // If cart doesn't exist, create a new one
    cart = new Cart({
      userId,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    // If item already exists in the cart, update the quantity
    const item = cart.items[itemIndex];
    const pricePerUnit = item.price / item.qty;
if(item.qty > qty){
    item.qty -= qty;
    item.price -= pricePerUnit * qty; // Update price if needed
}else{
  cart.items.splice(itemIndex, 1); // Remove item if qty is less than or equal to 1
  }
}else{
    return res.json({ message: "Item not found in cart"});
}

  await cart.save();
  res.json({ message: "Item quantity decreased", cart});
};



// increase product quantity in cart
// Add this to your --API/Controller/cart.js file

export const increaseProductQty = async (req, res) => {
  try {
    const { productId, qty } = req.body;
    const userId = req.user;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      // If item already exists in the cart, update the quantity
      const item = cart.items[itemIndex];

      // Calculate the price of a single unit
      const pricePerUnit = item.price / item.qty;

      // Increase the item's quantity
      item.qty += qty;
      
      // Update the item's total price based on the new quantity
      item.price += pricePerUnit * qty;
      
      await cart.save();
      res.json({ message: "Item quantity increased", cart, success: true });

    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error increasing product quantity:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// clear cart
export const clearCart = async (req, res) => {
  const userId = req.user; // temporary user id
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
    return res.json({ message: "Cart is already empty"});
  }else{
    cart.items = [];
    await cart.save();
    res.json({ message: "Cart cleared"});
  }

}
