import React, { useContext, useState } from "react";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const navigate = useNavigate();

  const { shippingAddress ,userAddress} = useContext(AppContext);
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
      <div
        className="container my-5 p-4 "
        style={{
          border: "2px solid yellow",
          borderRadius: "10px",
        }}
      >
        <h1 className="text-center">Shipping Address</h1>
        <form onSubmit={submitHandler} className="my-3">
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Full Name
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={onChangeHandler}
                type="text"
                className="form-control bg-dark text-light"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Country
              </label>
              <input
                name="country"
                value={formData.country}
                onChange={onChangeHandler}
                type="text"
                className="form-control bg-dark text-light"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">
                State
              </label>
              <input
                name="state"
                value={formData.state}
                onChange={onChangeHandler}
                type="text"
                className="form-control bg-dark text-light"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
          </div>
          <div className="row">
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">
                City
              </label>
              <input
                name="city"
                value={formData.city}
                onChange={onChangeHandler}
                type="text"
                className="form-control bg-dark text-light"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Pincode
              </label>
              <input
                name="pincode"
                value={formData.pincode}
                onChange={onChangeHandler}
                type="number"
                className="form-control bg-dark text-light"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>
            <div className="mb-3 col-md-4">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Phone Number
              </label>
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={onChangeHandler}
                type="number"
                className="form-control bg-dark text-light"
                id="exampleInputPassword1"
              />
            </div>

            <div className="row">
              <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">
                  Address/Nearby
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={onChangeHandler}
                  type="text"
                  className="form-control bg-dark text-light"
                  id="exampleInputPassword1"
                />
              </div>
            </div>
          </div>

          <div className="d-grid col-6 mx-auto my-3">
            <button type="submit" className="btn btn-primary"
            style={{fontWeight:"bold"}}
            >
              Submit
            </button>
          </div>
        </form>
        {userAddress && (
          <div className="d-grid col-6 mx-auto my-3">
          <button className="btn btn-warning"
          onClick={()=>{
            navigate("/checkout")
          }}
          style={{fontWeight:"bold"}}
          >Use Old Address</button>
        </div>
        )}
      </div>
    </>
  );
};

export default Address;
