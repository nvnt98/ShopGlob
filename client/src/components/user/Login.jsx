// src/components/user/Login.jsx
import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const onChangeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) navigate("/");
  };

  return (
    <div className="auth-container">
      <div className="auth-card shadow-lg">
        <h2 className="text-center mb-3">👋 Welcome Back</h2>
        <p className="text-center text-muted mb-4">
          Login to continue shopping with <b>ShopGlob</b>
        </p>

        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              name="email"
              value={email}
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
              value={password}
              onChange={onChangeHandler}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 mt-3">
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <span className="text-muted">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="link-highlight"
            >
              Register
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;