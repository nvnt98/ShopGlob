// src/components/Navbar.jsx
import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { setFilterData, products, logout, isAuthenticated, cart } =
    useContext(AppContext);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/product/search/${searchTerm}`);
    setSearchTerm("");
  };

  const filterbyCategory = (cat) => {
    if (!cat) return setFilterData(products);
    setFilterData(products.filter((d) => d.category.toLowerCase() === cat.toLowerCase()));
  };

  const filterbyPrice = (price) => {
    if (!price) return setFilterData(products);
    setFilterData(products.filter((d) => d.price <= price));
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm sticky-top py-2">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* LEFT: Brand */}
          <Link to="/" className="navbar-brand fw-bold text-warning me-3">
            ShopGlob
          </Link>

          {/* CENTER: Search Bar (hidden on mobile) */}
          <form
            className="search-wrapper flex-grow-1 mx-auto d-none d-lg-flex"
            onSubmit={submitHandler}
          >
            <div className="search-box d-flex align-items-center w-100">
              <span className="material-symbols-outlined me-2">search</span>
              <input
                className="form-control bg-transparent border-0 text-light"
                type="search"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="btn btn-warning ms-2" type="submit">
              Search
            </button>
          </form>

          {/* RIGHT: Hamburger */}
          <button
            className="navbar-toggler ms-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNav"
            aria-controls="mainNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible menu (Right side content) */}
          <div className="collapse navbar-collapse" id="mainNav">
            <ul className="navbar-nav ms-auto d-flex flex-column flex-lg-row align-items-lg-center mt-2 mt-lg-0">
              {isAuthenticated ? (
                <>
                  <li className="nav-item me-2">
                    <Link
                      to="/cart"
                      className="btn btn-primary position-relative w-100 my-1 my-lg-0"
                    >
                      🛒 Cart
                      {cart?.items?.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                          {cart.items.length}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li className="nav-item me-2">
                    <Link
                      to="/profile"
                      className="btn btn-outline-light w-100 my-1 my-lg-0"
                    >
                      👤 Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-danger w-100 my-1 my-lg-0"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  {/* Login/Register inside hamburger collapse */}
                  <li className="nav-item me-2">
                    <Link
                      to="/login"
                      className="btn btn-outline-light w-100 my-1"
                    >
                      Login
                    </Link>
                  </li>
                  <li className="nav-item me-2">
                    <Link
                      to="/register"
                      className="btn btn-warning w-100 my-1"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}

              {/* Explore Filters now in hamburger */}
              {location.pathname === "/" && (
                <li className="nav-item">
                  <button
                    className="btn btn-outline-warning w-100 my-1"
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Hide Filters ✖️" : "🔍 Explore Filters"}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* FILTERS BELOW */}
      {location.pathname === "/" && showFilters && (
        <div className="sub_bar">
          <div className="items" onClick={() => filterbyCategory(null)}>All</div>
          <div className="items" onClick={() => filterbyCategory("mobiles")}>Mobiles</div>
          <div className="items" onClick={() => filterbyCategory("laptops")}>Laptops</div>
          <div className="items" onClick={() => filterbyCategory("camera")}>Cameras</div>
          <div className="items" onClick={() => filterbyCategory("headphones")}>Headphones</div>
          <div className="items" onClick={() => filterbyCategory("tv")}>TVs</div>
          <div className="items" onClick={() => filterbyCategory("accessories")}>Accessories</div>
          <div className="items" onClick={() => filterbyPrice(10000)}>Under ₹10K</div>
          <div className="items" onClick={() => filterbyPrice(30000)}>Under ₹30K</div>
          <div className="items" onClick={() => filterbyPrice(50000)}>Under ₹50K</div>
          <div className="items" onClick={() => filterbyPrice(100000)}>Under ₹1L</div>
        </div>
      )}
    </>
  );
};

export default Navbar;