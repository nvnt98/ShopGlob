// src/components/product/ShowProduct.jsx
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import Loader from "../Loader";  // 👈 Import Loader

const ShowProduct = () => {
  const { filterData, addToCart,loading } = useContext(AppContext);
    // 👈 Show loader while loading
  if (loading) {
    return <Loader />;
  }

  // 👈 Show message if no products
  if (!filterData || filterData.length === 0) {
    return (
      <div className="container text-center my-5">
        <h3 className="text-light">No products found</h3>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row my-4">
        {filterData?.map((product) => (
          <div
            key={product._id}
            className="my-3 col-6 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
          >
            <div className="card bg-dark text-light text-center p-2">
              <Link
                to={`/product/${product._id}`}
                className="d-flex justify-content-center align-items-center p-3"
              >
                <img
                  src={product.imgSrc}
                  className="card-img-top"
                  alt={product.title}
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <div className="my-2 d-flex justify-content-center gap-2">
                  <button className="btn btn-primary">
                    ₹ {product.price}
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() =>
                      addToCart(
                        product._id,
                        product.title,
                        product.price,
                        1,
                        product.imgSrc
                      )
                    }
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowProduct;