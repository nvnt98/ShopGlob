// Cart.jsx
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const FREE_SHIPPING_THRESHOLD = 999;

const formatINR = (n = 0) =>
  n.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });

const Cart = () => {
  const { cart, decreaseQty, increaseQty, removeFromCart, clearCart } =
    useContext(AppContext);
  const items = cart?.items ?? [];
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let totalQty = 0;
    let totalPrice = 0;
    for (const item of items) {
      if (item) {
        totalQty += item.qty;
        totalPrice += item.price * item.qty;
      }
    }
    setQty(totalQty);
    setPrice(totalPrice);
  }, [items]);

  const remainingForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD - price);

  if (!items.length) {
    return (
      <div className="container cart-page text-center py-5">
        <div className="empty-state my-5">
          <div className="display-4">🛒</div>
          <h2 className="mt-3">Your Cart is Empty</h2>
          <p className="text-muted">Looks like you haven’t added anything yet.</p>
          <button
            className="btn btn-warning mt-3"
            style={{ fontWeight: "bold", fontSize: "1.1rem" }}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page pb-5">
      <div className="cart-header d-flex justify-content-between align-items-center mt-4">
        <div>
          <h2 className="mb-0">Your Cart</h2>
          <small className="text-muted">{qty} {qty === 1 ? "item" : "items"}</small>
        </div>
        <div className="d-none d-md-block">
          <button
            className="btn btn-outline-warning me-2"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              if (window.confirm("Are you sure you want to clear the entire cart?")) {
                clearCart();
              }
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>

      <div className="cart-container mt-4">
        <div className="cart-items-list d-flex flex-column gap-3">
          {items.map((product) => {
            const lineTotal = product.price * product.qty;
            return (
              <div key={product._id || product.productId} className="cart-item">
                <div className="thumb">
                  <img
                    src={product.imgSrc}
                    alt={product.title || "Product image"}
                  />
                </div>

                <div className="meta flex-grow-1">
                  <h5 className="mb-1">{product.title}</h5>
                  <div className="text-muted small">
                    Unit price: {formatINR(product.price)}
                  </div>

                  <div className="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <div className="qty-controls">
                        <button
                          className="btn btn-circle btn-minus"
                          aria-label="Decrease quantity"
                          disabled={product.qty <= 1}
                          onClick={() => decreaseQty(product.productId, 1)}
                          title="Decrease"
                        >
                          −
                        </button>
                        <span className="qty-badge">{product.qty}</span>
                        <button
                          className="btn btn-circle btn-plus"
                          aria-label="Increase quantity"
                          onClick={() => increaseQty(product.productId, 1)}
                          title="Increase"
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to remove this item?"
                            )
                          ) {
                            removeFromCart(product.productId);
                          }
                        }}
                        title="Remove item"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="price-row">
                      <span className="text-muted small me-2">Total:</span>
                      <span className="price text-warning">
                        {formatINR(lineTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="cart-summary">
          <h5 className="mb-3">Order Summary</h5>
          <div className="d-flex justify-content-between">
            <span>Items</span>
            <span>{qty}</span>
          </div>
          <div className="d-flex justify-content-between mt-2">
            <span>Subtotal</span>
            <span className="text-warning">{formatINR(price)}</span>
          </div>

          <div className="small mt-2">
            {remainingForFreeShip > 0 ? (
              <span className="text-muted">
                Add <b>{formatINR(remainingForFreeShip)}</b> more to unlock free shipping
              </span>
            ) : (
              <span className="text-success">You’ve unlocked free shipping 🎉</span>
            )}
          </div>

          <hr className="my-3" />

          <div className="d-grid gap-2">
            <button
              className="btn btn-success"
              style={{ fontWeight: "bold" }}
              onClick={() => navigate("/shipping")}
            >
              Checkout
            </button>
            <button
              className="btn btn-outline-warning"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear the entire cart?")) {
                  clearCart();
                }
              }}
            >
              Clear Cart
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile checkout bar */}
      <div className="checkout-bar d-md-none">
        <div>
          <strong>Total: </strong>
          <span className="text-warning">{formatINR(price)}</span>
        </div>
        <button
          className="btn btn-success btn-sm"
          onClick={() => navigate("/shipping")}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;