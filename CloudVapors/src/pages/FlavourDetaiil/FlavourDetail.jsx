import React, { useEffect, useState } from "react";
import "./style.css";
import t1 from "../../assets/t1.png";
import t2 from "../../assets/t2.png";
import t3 from "../../assets/t3.png";
import { useNavigate, useParams } from "react-router-dom";
import { app } from "../../firebase";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";

const FlavourDetaiil = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const db = getFirestore(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const ref = doc(db, "flavores", id);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
          const data = { id: snapshot.id, ...snapshot.data() };
          setProduct(data);
          setSelectedSize(data.sizes?.[0] || "");
          setMainImage(data.images?.[0] || "");
        }
      } catch (err) {
        console.error("Failed to load product", err);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedSize) return alert("Please select a size.");

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        image: mainImage,
        price: product.price,
        flavor: selectedSize,
        nicotineStrength: "",
        puffCount: "",
        quantity,
      })
    );

    alert("Flavor added to cart!");
    navigate("/cart");
  };

  return (
    <div className="flavour-detail-wrapper">
      <div className="flavour-gallery">
        <div className="flavour-thumbnails">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`thumb-${i}`}
              className="flavour-thumb-img"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
        <div className="flavour-main-image">
          {mainImage && <img src={mainImage} alt="main-flavour" />}
        </div>
      </div>

      <div className="flavour-info">
        <h1 className="flavour-title">{product.name}</h1>
        <div className="flavour-price">${product.price}</div>

        <div className="flavour-size-options">
          {product.sizes?.map((size) => (
            <button
              key={size}
              className={`flavour-size-btn ${selectedSize === size ? "active" : ""}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>

        <p className="flavour-description">{product.description}</p>

        <div className="flavour-quantity">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        <div className="flavour-actions">
          <button className="flavour-wishlist">Add to Wishlist</button>
          <button className="flavour-add-cart" onClick={handleAddToCart}>Add to Cart</button>
        </div>

        <div className="flavour-features">
          <div className="flavour-feature-item">
            <img src={t1} alt="Free Delivery" />
            <div><span>Free Delivery</span><small>1–2 days</small></div>
          </div>
          <div className="flavour-feature-item">
            <img src={t2} alt="In Stock" />
            <div><span>In Stock</span><small>Today</small></div>
          </div>
          <div className="flavour-feature-item">
            <img src={t3} alt="Guaranteed" />
            <div><span>Guaranteed</span><small>1 year</small></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlavourDetaiil;
