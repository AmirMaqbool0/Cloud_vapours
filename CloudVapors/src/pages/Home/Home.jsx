import React, { useEffect, useState } from "react";
import "./style.css";
import HomeBanner from "../../component/HomeBanner/HomeBanner";
import Vape from "../../assets/vape.png";
import ProductCard from "../../component/ProductCard/ProductCard";
import ProductImage from "../../assets/productimage.png";
import DeviceInfo1 from "../../assets/deviceinfo1.png";
import DeviceInfo2 from "../../assets/deviceinfo2.png";
import DeviceInfo3 from "../../assets/deviceinfo3.png";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import BlogCard from "../../component/BlogCard/BlogCard";
import HomeCta from "../../component/HomeCta/HomeCta";
import { app } from "../../firebase";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Link } from "react-router-dom";

const devices = [
  'All',
  'hayati pro max 6000',
  'Hayati Rubik 7000',
  'Hayati Mini 1500',
  'Crystal Pro CP 10K'
];

const testimonials = [
  {
    quote: "The service was absolutely impeccable. I see myself and my family visiting here much more frequently.",
    name: "John Doe",
    company: "SomeCompany LLC.",
    image: DeviceInfo1,
  },
  {
    quote: "I was so surprised at the quality of food. I didn't expect it to be this good for how cheap it all was. Awesome!",
    name: "John Doe",
    company: "SomeCompany LLC.",
    image: DeviceInfo2,
  },
  {
    quote: "That was amazing! I loved the pancakes. I've never had that type of taste hit my mouth before. Unreal!",
    name: "Jane Doe",
    company: "SomeCompany LLC.",
    image: DeviceInfo3,
  },
  {
    quote: "Excellent customer service and fast delivery. Will definitely order again!",
    name: "Sarah Smith",
    company: "TechCorp Inc.",
    image: DeviceInfo1,
  },
  {
    quote: "The products exceeded my expectations. Very happy with my purchase.",
    name: "Mike Johnson",
    company: "Design Studio",
    image: DeviceInfo2,
  },
  {
    quote: "Best in class products with amazing flavors. Highly recommended!",
    name: "Emily Wilson",
    company: "Marketing Pro",
    image: DeviceInfo3,
  },
];

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [products, setProducts] = useState([]);
  const [flavors, setFlavors] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('All');
  const [filteredFlavors, setFilteredFlavors] = useState([]);

  const prevSlide = () => {
    setTransition(true);
    setCurrentIndex(prev => 
      prev === 0 ? testimonials.length - 3 : prev - 1
    );
  };

  const nextSlide = () => {
    setTransition(true);
    setCurrentIndex(prev => 
      prev >= testimonials.length - 3 ? 0 : prev + 1
    );
  };

  // Get the current 3 testimonials to display
  const visibleTestimonials = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % testimonials.length;
    visibleTestimonials.push(testimonials[index]);
  }

  // -----------------------Get Products----------------
  const db = getFirestore(app);
  const Get_Products = async () => {
    const collectionRef = collection(db, 'Products');
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setProducts(arr);
  };

  // -----------------------Get Flavors----------------
  const Get_Flavors = async () => {
    const collectionRef = collection(db, 'flavores');
    const result = await getDocs(collectionRef);
    const arr = result.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setFlavors(arr);
    setFilteredFlavors(arr); // Initialize filtered flavors with all flavors
  };

  // Filter flavors based on selected device
  useEffect(() => {
    if (selectedDevice === 'All') {
      setFilteredFlavors(flavors);
    } else {
      const filtered = flavors.filter(flavor => 
        flavor.deviceName === selectedDevice
      );
      setFilteredFlavors(filtered);
    }
  }, [selectedDevice, flavors]);

  useEffect(() => {
    Get_Products();
    Get_Flavors();
  }, []);

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device);
  };

  return (
    <div className="home-container">
      <HomeBanner />

      <div className="feature-devices">
        {products.map((product, i) => (
          <div className="feature-device" key={`device-${i}`}>
            <div className="feature-device-img">
              <img src={product?.images?.[0]} alt="" />
            </div>
            <div className={i > 2 ? "color" : "feature-device-detail"}>
              <span>{product?.name || 'there is no name'} </span>
              <p>{product.description}</p>
              <Link to={`/productdetail/${product.id}`} style={{width:'100%'}}>
                <button>Explore Device</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="products-fillters">
        <p>Choose Your Device for Flavor</p>
        <div className="fillters">
          {devices.map((device, i) => (
            <div 
              className={`fillter-box ${selectedDevice === device ? 'active' : ''}`}
              key={`filter-${i}`}
              onClick={() => handleDeviceSelect(device)}
            >
              <img src={Vape} alt="" />
              <span>{device}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="products">
        {filteredFlavors.length > 0 ? (
          filteredFlavors.map((data, i) => (
            <div className="home-product" key={`product-${i}`}>
              <ProductCard data={data} />
            </div>
          ))
        ) : (
          <div className="no-flavors-message">
            <p>No flavors available for the selected device.</p>
          </div>
        )}
        <div className="view-more-btn">
          <Link to={'/flavours'}>
            <button>View All flavours</button>
          </Link>
        </div>
      </div>

      <div className="device-info">
        <div className="device-info-box">
          <div className="device-info-logo">
            <img src={DeviceInfo1} alt="" />
          </div>
          <span>Browse Devices & Flavors</span>
        </div>
        <div className="device-info-box">
          <div className="device-info-logo">
            <img src={DeviceInfo2} alt="" />
          </div>
          <span>Order Online or via WhatsApp</span>
        </div>
        <div className="device-info-box">
          <div className="device-info-logo">
            <img src={DeviceInfo3} alt="" />
          </div>
          <span>Fast Delivery to Your Door</span>
        </div>
      </div>

      <div className="customer-reviews-section">
        <div className="customer-review-heading">
          <span>Customer Reviews</span>
        </div>
        <div className="testimonial-carousel-container">
          <button className="nav left" onClick={prevSlide}>
            <FiChevronLeft />
          </button>
          <div className={`testimonial-carousel ${transition ? 'transition' : ''}`}>
            {visibleTestimonials.map((testimonial, i) => (
              <div 
                className="testimonial-slide"
                key={`${testimonial.name}-${i}`}
              >
                <FaQuoteLeft className="quote-icon left-quote" />
                <p className="quote-text">{testimonial.quote}</p>
                <FaQuoteRight className="quote-icon right-quote" />
                <div className="user-info">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="nav right" onClick={nextSlide}>
            <FiChevronRight />
          </button>
        </div>
      </div>

      <div className="home-blog">
        <div className="home-blog-heading">
          <span>From Our Blog</span>
        </div>
        <div className="home-blog-cards">
          {Array(3).fill().map((_, i) => (
            <div className="home-blog-card" key={`blog-${i}`}>
              <BlogCard />
            </div>
          ))}
        </div>
        <div className="home-blog-btn">
          <button>View All Post</button>
        </div>
      </div>
      <HomeCta />
    </div>
  );
};

export default Home;