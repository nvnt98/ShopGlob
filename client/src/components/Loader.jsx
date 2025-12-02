// src/components/Loader.jsx
import React from "react";
import "./Loader.css";

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        <div className="dot-loader">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="loader-text">Loading Products...</p>
      </div>
    </div>
  );
};

export default Loader;