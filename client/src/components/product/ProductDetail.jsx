// ProductDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RelatedProduct from "./RelatedProduct";
import AppContext from "../../context/AppContext";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ Grab `url` and `addToCart` from AppContext (AppState)
  const { addToCart, url } = useContext(AppContext);

  const [product, setProduct] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const api = await axios.get(`${url}/product/${id}`);
        setProduct(api.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id, url]);

  return (
    <>
      <div className="container my-5 detail-container">
        <div className="left">
          <div className="image-frame">
            <img
              src={product?.imgSrc}
              alt={product?.title || "Image Not Found"}
            />
          </div>
        </div>

        <div className="right text-start text-md-left">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <h1 className="mb-1">{product?.title}</h1>
            {product?.category && (
              <span className="badge-chip">{product.category}</span>
            )}
          </div>

          {product?.description && (
            <p className="detail-description mt-2 text-justify">
              {product.description}
            </p>
          )}

          <h2 className="price-highlight mt-2">₹{product?.price}</h2>

          <div className="my-4 d-flex flex-wrap gap-3 detail-actions">
            <button
              className="btn btn-danger"
              onClick={() => {
                addToCart(
                  product._id,
                  product.title,
                  product.price,
                  1,
                  product.imgSrc
                );
                navigate("/checkout");
              }}
            >
              Buy Now
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

      <RelatedProduct category={product?.category} />
    </>
  );
};

export default ProductDetail;