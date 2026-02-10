import React from "react";
import "./style.css";
import Mockup from '../../assets/mockup.webp'
const HomeBanner = () => {
  return (
    <div className="home-banner-container">
      <div className="home-banner-left">
        <span>Premium Legal Vapes. Fresh Flavors. Quick Delivery.</span>
        <p>
          Explore top-quality vape devices and pods, legal and ready for fast
          shipping.
        </p>
        <button>Shop Now</button>
      </div>
      <div className="home-banner-right">
        <div className="home-mockup">
          <img src={Mockup} alt="" />
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
