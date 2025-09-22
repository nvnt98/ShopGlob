import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RelatedProduct from "./RelatedProduct";

const ProductDetail = () => {
  const url = "http://localhost:3000/api";

  const [product, setProduct] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      //fetching data from backend
      const api = await axios.get(`${url}/product/${id}`, {
        Headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log(api.data.product);
      setProduct(api.data.product);
    };
    fetchProduct();
  }, [id]);

  return (
    <>
      <div className="container text-center my-5" style={{display:"flex" , justifyContent:"space-evenly", alignItems: "center" }}>
        <div className="left">
          <img src={product?.imgSrc} alt="Image Not Found" style={{width:"250px" , height: "250px" ,borderRadius:"10px", border:"2px solid yellow" }}  />
        </div>
        <div className="right">
          <h1>{product?.title}</h1>
          <p>{product.description}</p>
          <h1>{product?.price}{" ₹"}</h1>
          <div className="my-5">
            <button className="btn btn-danger mx-3" style={{fontWeight:"bold"}}>Buy Now</button>
            <button className="btn btn-warning" style={{fontWeight:"bold"}}>Add To Cart</button>
          </div>
      
        </div>
      </div>
      <RelatedProduct  category={product?.category} />
    </>
  );
};

export default ProductDetail;
