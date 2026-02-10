import React, { useEffect, useState } from "react";
import "./style.css";
import { ChevronRight, Truck, ShieldCheck, Blocks } from "lucide-react";
import { app } from "../../firebase";
import { collection, doc, getDoc, getFirestore } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../../redux/cartSlice";
import { useDispatch } from "react-redux";

const ProductDetail = () => {
  const [selectedColor, setSelectedColor] = useState("black");
  const [selectedStorage, setSelectedStorage] = useState("1TB");
  const [selectedNicotineStrength, setSelectedNicotineStrength] = useState("10");
  const [selectedPuffCount, setSelectedPuffCount] = useState("5000");
  const [wishlist, setWishlist] = useState(false);
  const [product, setProduct] = useState({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleAddToCart = () => {
    alert(`Added to cart: ${selectedStorage}, Color: ${selectedColor}`);
  };

  const handleWishlist = () => {
    setWishlist(!wishlist);
  };

  const { id } = useParams();
  const db = getFirestore(app);

  useEffect(() => {
    const Get_Product = async () => {
      try {
        const docRef = doc(db, "Products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          // Set default storage option if available
          if (docSnap.data().flavor?.length > 0) {
            setSelectedStorage(docSnap.data().flavor[0]);
          }
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error getting product:", error);
      }
    };

    if (id) {
      Get_Product();
    }
  }, [id]);

  const navigation = useNavigate();
  const dispatch = useDispatch();
  const Add_to_cart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image: product?.images?.[activeImageIndex], // Use currently selected image
        flavor: selectedStorage,
        nicotineStrength: selectedNicotineStrength,
        puffCount: selectedPuffCount,
        price: product.price,
      })
    );
    navigation('/cart');
    alert('Product Added To cart');
  };

  const handleThumbnailClick = (index) => {
    setActiveImageIndex(index);
  };

  return (
    <div className="product-detail-container">
      <div className="page-ref">
        <span>Home</span>
        <ChevronRight color="#A4A4A4" />
        <span>Device</span>
        <ChevronRight color="#A4A4A4" />
        <p>{product?.name}</p>
      </div>

      <div className="product-section">
        <div className="product-images">
          {/* Main Product Image */}
          <div className="main-image">
            {product?.images?.length > 0 ? (
              <img
                src={product.images[activeImageIndex]}
                alt={`Product ${activeImageIndex + 1}`}
              />
            ) : (
              <div className="image-placeholder">No Image Available</div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="thumbnail-column">
            {product?.images?.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${index === activeImageIndex ? "active" : ""}`}
                onClick={() => handleThumbnailClick(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product?.name}</h2>
          <div className="price">
            <span className="current-price">${product?.price}</span>
            {product?.original_price && (
              <span className="old-price">${product?.original_price}</span>
            )}
          </div>

          <div className="storage-selector">
            {product?.flavor?.map((flavor, i) => (
              <button
                key={i}
                className={`storage-btn ${
                  selectedStorage === flavor ? "active" : ""
                }`}
                onClick={() => setSelectedStorage(flavor)}
              >
                {flavor}
              </button>
            ))}
          </div>

          {/* Nicotine Strength Selector */}
          <div className="option-selector">
            <h4>Nicotine Strength</h4>
            <div className="option-buttons">
              {product?.nicotine_strengths?.map((strength, i) => (
                <button
                  key={i}
                  className={`option-btn ${
                    selectedNicotineStrength === strength ? "active" : ""
                  }`}
                  onClick={() => setSelectedNicotineStrength(strength)}
                >
                  {strength}mg
                </button>
              ))}
            </div>
          </div>

          {/* Puff Count Selector */}
          {product?.puff_counts && product.puff_counts.length > 0 && (
            <div className="option-selector">
              <h4>Puff Count</h4>
              <div className="option-buttons">
                {product.puff_counts.map((count, i) => (
                  <button
                    key={i}
                    className={`option-btn ${
                      selectedPuffCount === count ? "active" : ""
                    }`}
                    onClick={() => setSelectedPuffCount(count)}
                  >
                    {count} puffs
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-features">
            {product?.features?.map((feature, i) => (
              <div className="feature" key={i}>
                {feature}
              </div>
            ))}
          </div>

          <p className="product-description">{product.description}</p>

          <div className="actions">
            <button onClick={handleWishlist} className="wishlist-btn">
              {wishlist ? "❤ In Wishlist" : "Add to Wishlist"}
            </button>
            <button onClick={Add_to_cart} className="cart-btn">
              Add to Cart
            </button>
          </div>

          <div className="service-info">
            <div className="services-info-box">
              <div className="services-info-logo">
                <Truck />
              </div>
              <div className="services-info-text">
                <span>Free Delivery</span>
                <p>1-2 day </p>
              </div>
            </div>
            <div className="services-info-box">
              <div className="services-info-logo">
                <Blocks />
              </div>
              <div className="services-info-text">
                <span>In Stock</span>
                <p>Today</p>
              </div>
            </div>
            <div className="services-info-box">
              <div className="services-info-logo">
                <ShieldCheck />
              </div>
              <div className="services-info-text">
                <span>Guaranteed</span>
                <p>1 year</p>
              </div>
            </div>
          </div>
        </div>
      </div>


      {product?.details && (
        <div className="product-detail">
          <div className="product-detail-heading">
            <h2>Details</h2>
            {product.details.description && (
              <p>{product.details.description}</p>
            )}
          </div>
          {product.details.specifications?.map((spec, i) => (
            <div 
              className={`product-detail-point ${i === product.details.specifications.length - 1 ? "last-point" : ""}`}
              key={i}
            >
              <span>{spec.name}</span>
              <span>{spec.value}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductDetail;