// src/components/user/Login.jsx
import React, { useState, useContext } from "react";
import AppContext from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AppContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });

  const { email, password } = formData;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate("/");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* LEFT SIDE */}
        <div className="login-left">
          <h2>👋 Welcome Back to ShopGlob</h2>
          <p>Login to continue your shopping journey.</p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="login-right">
          <h2 className="mb-4 text-center">Login</h2>
          <form onSubmit={submitHandler}>
            {/* Email */}
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                name="email"
                value={email}
                onChange={onChangeHandler}
                type="email"
                className="form-control bg-secondary text-light"
                placeholder="Enter Email"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                name="password"
                value={password}
                onChange={onChangeHandler}
                type="password"
                className="form-control bg-secondary text-light"
                placeholder="Enter Password"
                required
              />
            </div>

            {/* Login Button */}
            <div className="d-grid mt-4">
              <button type="submit" className="btn btn-warning" style={{ fontWeight: "bold" }}>
                Login
              </button>
            </div>
          </form>

          {/* Bottom link */}
          <div className="text-center mt-3">
            <small>
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                style={{ color: "skyblue", cursor: "pointer" }}
              >
                Register
              </span>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;