import React, { useEffect, useState } from "react";

const OrderConfirmation = () => {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const savedOrder = JSON.parse(localStorage.getItem("lastOrder"));
    if (savedOrder) {
      setOrder(savedOrder);
    }
  }, []);

  if (!order) {
    return (
      <div className="container my-5 text-center">
        <h2>No order found 🛒</h2>
        <p>Please go back to checkout.</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4 text-success">🎉 Order Confirmed!</h1>
      <p className="text-center mb-5">
        Your order has been placed successfully.
      </p>

      <div className="row">
        {/* ## Left Column: Ordered Items Table */}
        <div className="col-md-8">
          <div className="table-responsive">
            <table className="table table-bordered table-dark table-striped align-middle">
              <thead>
                <tr className="text-center">
                  <th scope="col">Product</th>
                  <th scope="col">Price</th>
                  <th scope="col">Quantity</th>
                  <th scope="col">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
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
                    <td>{item.qty}</td>
                    <td>₹{(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ## Right Column: Order Details + Shipping */}
        <div className="col-md-4">
          {/* Order Details */}
          <div className="card bg-dark text-light mb-4">
            <div className="card-body">
              <h5 className="card-title mb-3">Order Details</h5>
              <p><strong>Order ID:</strong> {order.orderId}</p>
              <p><strong>Payment ID:</strong> {order.paymentId}</p>
              <p><strong>Amount Paid:</strong> ₹{order.amount}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card bg-dark text-light">
            <div className="card-body">
              <h5 className="card-title mb-3">Shipping Address</h5>
              {order.shipping ? (
                <>
                  <p><strong>{order.shipping.fullName}</strong></p>
                  <p>{order.shipping.address}</p>
                  <p>{order.shipping.city}, {order.shipping.pincode}</p>
                  <p>{order.shipping.country}</p>
                </>
              ) : (
                <p>No shipping address found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;