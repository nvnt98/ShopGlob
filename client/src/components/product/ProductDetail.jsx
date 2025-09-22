// ProductDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import RelatedProduct from "./RelatedProduct";
import AppContext from "../../context/AppContext";

const ProductDetail = () => {
  const url = "http://localhost:3000/api";
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useContext(AppContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const api = await axios.get(`${url}/product/${id}`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        setProduct(api.data.product);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <>
      <div className="container text-center my-5 detail-container">
        <div className="left">
          <img src={product?.imgSrc} alt={product?.title || "Image Not Found"} />
        </div>
        <div className="right text-start text-md-left">
          <h1>{product?.title}</h1>
          <p>{product?.description}</p>
          <h2 className="text-warning">{product?.price} ₹</h2>

          <div className="my-4 d-flex flex-wrap gap-3">
            {/* ✅ Buy Now */}
            <button
              className="btn btn-danger"
              onClick={() => {
                addToCart(
                  product._id,
                  product.title,
                  product.price,
                  1,               // Always at least one item!
                  product.imgSrc
                );
                navigate("/checkout");
              }}
            >
              Buy Now
            </button>

            {/* ✅ Add To Cart */}
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

      {/* ✅ Related Products */}
      <RelatedProduct category={product?.category} />
    </>
  );
};

export default ProductDetail;