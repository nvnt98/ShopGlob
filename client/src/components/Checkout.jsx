import React, { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const { cart, userAddress, decreaseQty, increaseQty, removeFromCart, url, user, clearCart } =
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



  const handlePayment = async () => {
    try {
      const orderResponse = await axios.post(`${url}/payment/checkout`, {
        amount: price,
        qty: qty,
        cartItems: cart.items,
        userShipping: userAddress,
        userId: user._id
      });
      // console.log("Order Response:", orderResponse);
      const { orderId, amount: orderAmount } = orderResponse.data;

      var options = {

        "key": "rzp_test_RJnkRIWWiPQqd1", // Enter the Key ID generated from the Dashboard

        "amount": orderAmount,
        // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise

        "currency": "INR",

        "name": "Navneet Kumar Gond",

        "description": "Test Transaction",

        "order_id": orderId, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

        "handler": async function (response) {

          const paymentData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            amount: orderAmount,
            orderItems: cart?.items,
            userId: user._id,
            userShipping: userAddress
          };

          const api = await axios.post(`${url}/payment/verify-payment`, paymentData);

          // console.log("Razorpay Response:", api.data);
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

        "prefill": {

          "name": "Gaurav Kumar",

          "email": "gaurav.kumar@example.com",

          "contact": "9000090000"

        },

        "notes": {

          "address": "Razorpay Corporate Office"

        },

        "theme": {

          "color": "#3399cc"

        }

      };

      var rzp = new window.Razorpay(options);
      rzp.open();




    } catch (error) {
      console.error("Error during payment initiation:", error);
    }
  }


  // This state now represents the total price of all products
  const [totalPrice, setTotalPrice] = useState(0);
  // const navigate = useNavigate();

  // Recalculate the total price whenever the cart items change
  useEffect(() => {
    let total = 0;
    if (cart?.items) {
      cart.items.forEach((item) => {
        total += item.price * item.qty;
      });
    }
    setTotalPrice(total);
  }, [cart]);

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Order Summary</h1>

      {!cart?.items?.length ? (
        <div className="text-center">
          <h2>Your cart is empty. Please add items to proceed.</h2>
          <button
            className="btn btn-warning mt-3"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row">
          {/* ## Column 1: Item Details with Images */}
          <div className="col-md-8">
            <div className="table-responsive">
              <table className="table table-bordered table-dark table-striped align-middle">
                <thead>
                  <tr className="text-center">
                    <th scope="col">Product</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.productId} className="text-center">
                      <td className="d-flex align-items-center justify-content-start">
                        <img
                          src={item.imgSrc}
                          alt={item.title}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "8px",
                            marginRight: "15px",
                          }}
                        />
                        <span>{item.title}</span>
                      </td>
                      <td>₹{item.price}</td>
                      <td className="text-center">
                        <button
                          onClick={() => decreaseQty(item.productId, 1)}
                          className="btn btn-secondary btn-sm mx-1"
                        >
                          -
                        </button>
                        <b className="mx-2">{item.qty}</b>
                        <button
                          onClick={() => increaseQty(item.productId, 1)}
                          className="btn btn-secondary btn-sm mx-1"
                        >
                          +
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            if (window.confirm("Remove this item?")) {
                              removeFromCart(item.productId);
                            }
                          }}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ## Column 2: Latest Shipping Address & Price Details */}
          <div className="col-md-4">
            <div className="card bg-dark text-light">
              <div className="card-body">
                <h5 className="card-title mb-3">Shipping To</h5>
                {userAddress ? (
                  <>
                    <p className="card-text mb-1">
                      <strong>{userAddress.fullName}</strong>
                    </p>
                    <p className="card-text small mb-1">{userAddress.address}</p>
                    <p className="card-text small mb-1">
                      {userAddress.city}, {userAddress.pincode}
                    </p>
                    <p className="card-text small">{userAddress.country}</p>
                  </>
                ) : (
                  <div className="text-center">
                    <p>Please add a shipping address.</p>
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/shipping")}
                    >
                      Add Address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ## Simplified Price Details Section ## */}
            <div className="card bg-dark text-light mt-4">
              <div className="card-body">
                <h5 className="card-title">Price Details</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item bg-dark text-warning d-flex justify-content-between">
                    <strong>Total Amount:</strong>
                    <strong>₹{totalPrice.toFixed(2)}</strong>
                  </li>
                </ul>
                <div className="d-grid mt-3">
                  <button
                    className="btn btn-success"
                    disabled={!userAddress}
                    onClick={() => handlePayment()}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;