// Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, decreaseQty, increaseQty, removeFromCart, clearCart } =
    useContext(AppContext);
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let totalQty = 0;
    let totalPrice = 0;

    // This logic is safe because of the "?." check
    if (cart?.items) {
      for (const item of cart.items) {
        if (item) {
          totalQty += item.qty;
          totalPrice += item.price * item.qty;
        }
      }
    }
    setQty(totalQty);
    setPrice(totalPrice);
  }, [cart]);

  return (
    <>
      {/* THIS IS THE ONLY LINE THAT WAS CHANGED 👇 */}
      {!cart?.items?.length ? (
        <div className="text-center my-5">
          <h2>Your Cart is Empty</h2>
          <button
            className="btn btn-warning mx-3 mt-3"
            style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            onClick={() => navigate("/")}
          >
            Continue Shopping...
          </button>
        </div>
      ) : (
        <>
          <div className="my-5 text-center">
            <button
              className="btn btn-info mx-3"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              Total Qty : {qty}
            </button>
            <button
              className="btn btn-warning mx-3"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              Total Price : ₹{price}
            </button>
          </div>

          {cart.items.map((product) => (
            <div key={product._id} className="container bg-dark my-3 p-3 rounded">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <div className="cart_img">
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "10px",
                    }}
                  />
                </div>
                <div className="cart_desc text-light">
                  <h4>{product.title}</h4>
                  <h5>Price: ₹{product.price}</h5>
                  <h5>Qty : {product.qty}</h5>
                </div>
                <div className="cart_action">
                  <button
                    className="btn btn-warning mx-2"
                    style={{ fontWeight: "bold" }}
                    onClick={() => decreaseQty(product.productId, 1)}
                  >
                    Qty--
                  </button>
                  <button
                    className="btn btn-info mx-2"
                    style={{ fontWeight: "bold" }}
                    onClick={() => increaseQty(product.productId, 1)}
                  >
                    Qty++
                  </button>
                  <button
                    className="btn btn-danger mx-2"
                    style={{ fontWeight: "bold" }}
                    onClick={() => {
                      if (window.confirm("Are you sure you want to remove this item?")) {
                        removeFromCart(product.productId);
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          <div className="container text-center my-4">
            <button
              className="btn btn-success mx-3"
              style={{ fontWeight: "bold" }}
              onClick={() => navigate("/shipping")}
            >
              Checkout
            </button>
            <button
              className="btn btn-danger mx-3"
              style={{ fontWeight: "bold" }}
              onClick={() => {
                if (window.confirm("Are you sure you want to clear the entire cart?")) {
                  clearCart();
                }
              }}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default Cart;