// src/components/user/Register.jsx
import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await register(formData.name, formData.email, formData.password);
    if (res.success) navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <h2 className="text-center mb-3">🙌 Create an Account</h2>
        <p className="text-center text-muted mb-4">
          Join <b>ShopGlob</b> and explore amazing deals
        </p>

        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label>Name</label>
            <input
              className="form-control"
              name="name"
              value={formData.name}
              onChange={onChangeHandler}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              placeholder="Enter a strong password"
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100 mt-3">
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="link-highlight"
            >
              Login
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;