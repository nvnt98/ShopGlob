// src/components/product/ShowProduct.jsx
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

const ShowProduct = () => {
  const { filterData, addToCart, loading, error, retryFetchProducts } = useContext(AppContext);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h4 className="mt-3 text-light">Loading Products...</h4>
        <p className="text-muted">
          Server might be waking up. This may take up to 60 seconds on first load.
        </p>
      </div>
    );
  }

  // ✅ Error State
  if (error) {
    return (
      <div className="container text-center my-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Oops!</h4>
          <p>{error}</p>
          <hr />
          <button className="btn btn-primary" onClick={retryFetchProducts}>
            🔄 Retry Loading Products
          </button>
        </div>
      </div>
    );
  }

  // ✅ No Products State
  if (!filterData || filterData.length === 0) {
    return (
      <div className="container text-center my-5">
        <h4 className="text-light">No products found 😕</h4>
      </div>
    );
  }

  // ✅ Products Loaded Successfully
  return (
    <div className="container">
      <div className="row my-4">
        {filterData.map((product) => (
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
                  loading="lazy"
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