import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AppContext from "../context/AppContext";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { setFilterData, products, logout, isAuthenticated, cart} =
    useContext(AppContext);

  const location = useLocation();

  const filterbyCategory = (cat) => {
    if (!cat) {
      setFilterData(products);
    } else {
      setFilterData(
        products.filter(
          (data) => data.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }
  };
  const filterbyPrice = (price) => {
    if (!price) {
      setFilterData(products);
    } else {
      setFilterData(products.filter((data) => data.price <= price));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/product/search/${searchTerm}`);
    setSearchTerm("");
  };
  return (
    <>
      <div className="nav sticky-top">
        <div className="nav_bar">
          <Link
            to={"/"}
            className="left"
            style={{ textDecoration: "none", color: "white" }}
          >
            <h3>ShopGlob</h3>
          </Link>
          <form className="search_bar" onSubmit={submitHandler}>
            <span className="material-symbols-outlined">search</span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search Products..."
            />
          </form>
          <div className="right">
            {isAuthenticated && (
              <>
                <Link to={"/cart"}
                  type="button"
                  className="btn btn-primary position-relative mx-3"
                >
                  Cart
                 {cart?.items?.length>0 && (
                   <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cart?.items?.length}
                    <span className="visually-hidden">unread messages</span>
                  </span>
                 )}
                </Link>

                <Link to={"/profile"} className="btn btn-primary mx-3">
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="btn btn-danger mx-3"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link to={"/login"} className="btn btn-secondary mx-3">
                  Login
                </Link>
                <Link to={"/register"} className="btn btn-info mx-3">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {location.pathname == "/" && (
          <div className="sub_bar">
            <div className="items" onClick={() => filterbyCategory(null)}>
              No Filter
            </div>
            <div className="items" onClick={() => filterbyCategory("mobiles")}>
              Mobiles
            </div>
            <div className="items" onClick={() => filterbyCategory("laptops")}>
              Laptops
            </div>
            <div className="items" onClick={() => filterbyCategory("camera")}>
              Camera
            </div>
            <div
              className="items"
              onClick={() => filterbyCategory("headphones")}
            >
              Headphones
            </div>
            <div
              className="items"
              onClick={() => filterbyCategory("tv")}
            >
              TV & Monitors
            </div>
            <div
              className="items"
              onClick={() => filterbyCategory("accessories")}
            >
              Accessories
            </div>
            <div className="items" onClick={() => filterbyPrice(999)}>
              999
            </div>
            <div className="items" onClick={() => filterbyPrice(10000)}>
              10000
            </div>
            <div className="items" onClick={() => filterbyPrice(30000)}>
              30000
            </div>
            <div className="items" onClick={() => filterbyPrice(50000)}>
              50000
            </div>
            <div className="items" onClick={() => filterbyPrice(90000)}>
              90000
            </div>
            <div className="items" onClick={() => filterbyPrice(500000)}>
              500000
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
