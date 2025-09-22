import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

const ShowProduct = () => {
  const { products, filterData, addToCart } = useContext(AppContext); //destructuring the products from context

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center ">
        <div className="row container d-flex justify-content-center align-items-center my-5 ">
          {filterData?.map((product) => (
            <div
              key={product._id}
              className=" my-3 col-md-4 d-flex justify-content-center align-items-center "
            >
              <div
                className="card bg-dark text-light text-center"
                style={{ width: "18rem" }}
              >
                <Link
                  to={`/product/${product._id}`}
                  className="d-flex justify-content-center align-items-center p-3 "
                >
                  <img
                    src={product.imgSrc}
                    className="card-img-top"
                    alt="..."
                    style={{
                      width: "200px",
                      height: "200px",
                      borderRadius: "10px",
                      border: "2px solid yellow",
                    }}
                  />
                </Link>
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <div className="my-3">
                    <button className="btn btn-primary mx-3">
                      {product.price}
                      {" ₹"}
                    </button>
                    <button
                      onClick={() => {
                        addToCart(
                          product._id,
                          product.title,
                          product.price,
                          product.qty,
                          product.imgSrc
                        );
                      }}
                      className="btn btn-warning"
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
    </>
  );
};

export default ShowProduct;
