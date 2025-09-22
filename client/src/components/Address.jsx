// Address.jsx
import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();

  const { shippingAddress, userAddress } = useContext(AppContext);
  const [formData, setformData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNumber: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
  };

  const { fullName, address, city, state, country, pincode, phoneNumber } =
    formData;

  const submitHandler = async (e) => {
    e.preventDefault();

    const result = await shippingAddress(
      fullName,
      address,
      city,
      state,
      country,
      pincode,
      phoneNumber
    );

    if (result && result.success) {
      navigate("/checkout");
    }

    setformData({
      fullName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phoneNumber: "",
    });
  };

  return (
    <>
      <div className="container my-5">
        <div className="address-card p-4 p-md-5">
          <div className="address-header text-center mb-4">
            <h1 className="mb-1">Shipping Address</h1>
            <p className="text-muted mb-0">Please provide your delivery details.</p>
          </div>

          <form onSubmit={submitHandler} className="my-3">
            <div className="row">
              <div className="mb-3 col-md-4">
                <label htmlFor="fullName" className="form-label">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={onChangeHandler}
                  type="text"
                  className="form-control"
                  placeholder="e.g., Rahul Sharma"
                  autoComplete="name"
                />
              </div>

              <div className="mb-3 col-md-4">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={onChangeHandler}
                  type="text"
                  className="form-control"
                  placeholder="e.g., India"
                  autoComplete="country-name"
                />
              </div>

              <div className="mb-3 col-md-4">
                <label htmlFor="state" className="form-label">State</label>
                <input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={onChangeHandler}
                  type="text"
                  className="form-control"
                  placeholder="e.g., Maharashtra"
                  autoComplete="address-level1"
                />
              </div>
            </div>

            <div className="row">
              <div className="mb-3 col-md-4">
                <label htmlFor="city" className="form-label">City</label>
                <input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={onChangeHandler}
                  type="text"
                  className="form-control"
                  placeholder="e.g., Mumbai"
                  autoComplete="address-level2"
                />
              </div>

              <div className="mb-3 col-md-4">
                <label htmlFor="pincode" className="form-label">Pincode</label>
                <input
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={onChangeHandler}
                  type="number"
                  className="form-control"
                  placeholder="e.g., 400001"
                  inputMode="numeric"
                />
              </div>

              <div className="mb-3 col-md-4">
                <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={onChangeHandler}
                  type="number"
                  className="form-control"
                  placeholder="e.g., 9876543210"
                  inputMode="numeric"
                />
              </div>

              <div className="row">
                <div className="mb-3 col-12">
                  <label htmlFor="address" className="form-label">Address / Nearby</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={onChangeHandler}
                    className="form-control"
                    placeholder="House no., street, area, landmark"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div className="d-grid col-6 mx-auto my-3">
              <button type="submit" className="btn btn-primary" style={{ fontWeight: "bold" }}>
                Submit
              </button>
            </div>
          </form>

          {userAddress && (
            <div className="d-grid col-6 mx-auto my-3">
              <button
                className="btn btn-warning"
                onClick={() => navigate("/checkout")}
                style={{ fontWeight: "bold" }}
              >
                Use Old Address
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Address;