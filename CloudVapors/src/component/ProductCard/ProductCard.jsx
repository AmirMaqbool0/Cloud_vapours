import React, { useEffect, useState } from "react";
import "./style.css";
import { Heart } from "lucide-react";
// import ProductImage from "../../assets/productimage.png";
import { Link } from "react-router-dom";

const ProductCard = ({ data }) => {
  const Short_Tital = (name) =>{
    const shortName = name.substring(0,10)
    return shortName
  }
  return (
    <div className="product-card-container">
      <div className="product-card-like">
        <Heart />
      </div>
      <div className="producr-img">
        <img src={data.images[0]} alt="" />
      </div>
      <div className="product-card-detail">
        <span>{Short_Tital(data.name)}...</span>
        <div className="product-tags">
          <div className="product-tag">
            <p>{data.deviceName}</p>
          </div>
        </div>
        <h1>$ {data.price}</h1>
        <Link to={`/flavour/${data.id}`} style={{ width: "100%" }}>
          {" "}
          <button>Buy Now</button>{" "}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
