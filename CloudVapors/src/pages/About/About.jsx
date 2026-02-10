import React from "react";
import "./style.css";
import Heading from "../../component/Heading/Heading";
import image1 from "../../assets/wape.png";
import image2 from "../../assets/flavor.png";
import howWeStartImg from "../../assets/abc.png";

// Importing icons
import { FaRunning, FaSnowflake, FaHome, FaShippingFast } from "react-icons/fa";

const About = () => {
  return (
    <>
      <Heading
        text={"About us"}
        head={"About the company"}
        info={"Learn more about the company and the team behind it."}
      />

      <div className="about-main-container">
        <div className="about-content">
          <div className="about-left">
            <p className="sub-heading">Your Trusted Vape Partner</p>
            <h2>
              Premium devices,
              <br />
              exceptional flavors, and a<br />
              passion for quality.
            </h2>
            <div className="vape-images">
              <img src={image1} alt="Cotton and Flavors" className="vape-img" />
              <img src={image2} alt="Vape Bottles" className="vape-img" />
            </div>
          </div>

          <div className="about-right">
            <div className="about-info">
              <h3>400+</h3>
              <p>
                premium vape devices and accessories curated for every taste.
              </p>
            </div>
            <div className="about-info">
              <h3>600%</h3>
              <p>return on investment – because your experience matters.</p>
            </div>
            <div className="about-info">
              <h3>Over 50+</h3>
              <p>
                flavors in stock, from fresh mints to juicy fruits and nostalgic
                classics.
              </p>
            </div>
            <div className="about-info">
              <h3>200+</h3>
              <p>
                five-star reviews – real feedback from real vapers who trust us.
              </p>
            </div>
          </div>
        </div>

        {/* How We Started Section */}
        <div className="how-we-start-main-container">
          <div className="about-how-we-start-left-container">
            <img
              src={howWeStartImg}
              alt="How We Started"
              className="how-we-start-image"
            />
          </div>

          <div className="about-how-we-start-right-container">
            <span>How We Started</span>
            <p>
              Founded with the mission to bring top-quality vaping products to
              enthusiasts across the UK, we source only the best, fully
              compliant devices and flavors. Our team is dedicated to offering
              not just products, but a reliable, safe, and enjoyable vaping
              experience.
            </p>
          </div>
        </div>

        {/* What We Offer Section */}
        <div className="what-we-offer-main-container">
          <div className="what-we-offer-heading">
            <span>What We Offer</span>
          </div>

          <div className="what-we-offer-features">
            <div className="offer-box">
              <div className="offer-icon">
                <FaRunning />
              </div>
              <p>Browse Devices & Flavors</p>
            </div>
            <div className="offer-box">
              <div className="offer-icon">
                <FaSnowflake />
              </div>
              <p>Fresh Flavors</p>
            </div>
            <div className="offer-box">
              <div className="offer-icon">
                <FaHome />
              </div>
              <p>Order Online or via WhatsApp</p>
            </div>
            <div className="offer-box">
              <div className="offer-icon">
                <FaShippingFast />
              </div>
              <p>Fast Delivery to Your Door</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
