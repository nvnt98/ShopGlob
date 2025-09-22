// Checkout.jsx
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const {
    cart,
    userAddress,
    decreaseQty,
    increaseQty,
    removeFromCart,
    url,
    user,
    clearCart,
  } = useContext(AppContext);

  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let totalQty = 0;
    let totalPriceAcc = 0;

    if (cart?.items) {
      for (const item of cart.items) {
        if (item) {
          totalQty += item.qty;
          totalPriceAcc += item.price * item.qty;
        }
      }
    }
    setQty(totalQty);
    setPrice(totalPriceAcc);
  }, [cart]);

  useEffect(() => {
    let total = 0;
    if (cart?.items) {
      cart.items.forEach((item) => {
        total += item.price * item.qty;
      });
    }
    setTotalPrice(total);
  }, [cart]);

  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${url}/payment/checkout`, {
        amount: price,
        qty: qty,
        cartItems: cart.items,
        userShipping: userAddress,
        userId: user._id,
      });

      const { orderId, amount: orderAmount } = orderResponse.data;

      var options = {
        key: "rzp_test_RJnkRIWWiPQqd1",
        amount: orderAmount,
        currency: "INR",
        name: "Navneet Kumar Gond",
        description: "Test Transaction",
        order_id: orderId,
        handler: async function (response) {
          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: orderAmount,
            orderItems: cart?.items,
            userId: user._id,
            userShipping: userAddress,
          };

          const api = await axios.post(`${url}/payment/verify-payment`, paymentData);

          if (api.data.success) {
            const orderSummary = {
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              items: cart.items,
              amount: orderAmount,
              shipping: userAddress,
            };

            localStorage.setItem("lastOrder", JSON.stringify(orderSummary));

            clearCart();
            navigate("/orderConfirmation");
          }
        },
        prefill: {
          name: "Gaurav Kumar",
          email: "gaurav.kumar@example.com",
          contact: "9000090000",
        },
        notes: { address: "Razorpay Corporate Office" },
        theme: { color: "#3399cc" },
      };

      var rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during payment initiation:", error);
    }
  };

  return (
    <div className="container my-5 checkout-page">
      <div className="checkout-header d-flex justify-content-between align-items-end">
        <div>
          <h1 className="mb-0">Checkout</h1>
          <small className="text-muted">
            {qty} {qty === 1 ? "item" : "items"} in your order
          </small>
        </div>
        <div className="d-none d-md-inline">
          <button className="btn btn-outline-warning me-2" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
          <button
            className="btn btn-outline-danger"
            onClick={() => {
              if (window.confirm("Clear entire cart?")) clearCart();
            }}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {!cart?.items?.length ? (
        <div className="text-center my-5">
          <h2>Your cart is empty. Please add items to proceed.</h2>
          <button className="btn btn-warning mt-3" onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="checkout-grid mt-4">
          {/* Items list */}
          <div className="items-card">
            <h5 className="mb-3">Items</h5>

            <div className="items-list d-flex flex-column gap-3">
              {cart.items.map((item) => {
                const lineTotal = item.price * item.qty;
                return (
                  <div key={item.productId} className="checkout-item">
                    <div className="thumb">
                      <img
                        src={item.imgSrc}
                        alt={item.title}
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/80";
                        }}
                      />
                    </div>
                    <div className="meta flex-grow-1">
                      <h6 className="mb-1">{item.title}</h6>
                      <div className="small text-muted">Unit price: ₹{item.price}</div>

                      <div className="d-flex align-items-center justify-content-between mt-2 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <div className="qty-controls">
                            <button
                              className="btn btn-circle btn-minus"
                              aria-label="Decrease quantity"
                              disabled={item.qty <= 1}
                              onClick={() => decreaseQty(item.productId, 1)}
                            >
                              −
                            </button>
                            <span className="qty-badge">{item.qty}</span>
                            <button
                              className="btn btn-circle btn-plus"
                              aria-label="Increase quantity"
                              onClick={() => increaseQty(item.productId, 1)}
                            >
                              +
                            </button>
                          </div>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => {
                              if (window.confirm("Remove this item?")) {
                                removeFromCart(item.productId);
                              }
                            }}
                          >
                            Remove
                          </button>
                        </div>

                        <div className="price-row">
                          <span className="text-muted small me-2">Total:</span>
                          <span className="price text-warning">₹{lineTotal}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column: Shipping + Summary */}
          <aside className="checkout-summary">
            <div className="shipping-card mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5 className="mb-0">Shipping To</h5>
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => navigate("/shipping")}
                >
                  {userAddress ? "Change" : "Add"}
                </button>
              </div>

              {userAddress ? (
                <>
                  <div className="fw-semibold">{userAddress.fullName}</div>
                  <div className="small text-muted mt-1">{userAddress.address}</div>
                  <div className="small text-muted">
                    {userAddress.city}, {userAddress.pincode}
                  </div>
                  <div className="small text-muted">{userAddress.country}</div>
                </>
              ) : (
                <div className="text-muted small">
                  No address added yet. Please add your shipping address.
                </div>
              )}
            </div>

            <div className="summary-card">
              <h5 className="mb-3">Price Details</h5>
              <div className="d-flex justify-content-between">
                <span>Items</span>
                <span>{qty}</span>
              </div>
              <div className="d-flex justify-content-between mt-2">
                <span>Subtotal</span>
                <span className="text-warning">₹{totalPrice.toFixed(2)}</span>
              </div>

              <hr className="my-3" />

              <div className="d-grid gap-2">
                <button
                  className="btn btn-success"
                  disabled={!userAddress}
                  onClick={handlePayment}
                >
                  Proceed to Payment
                </button>
                <button className="btn btn-outline-warning" onClick={() => navigate("/")}>
                  Continue Shopping
                </button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Checkout;