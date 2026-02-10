import React, { useState } from "react";
import "./style.css";
import img from "../../assets/svgs/Vector.svg";
import img2 from "../../assets/svgs/Vector2.svg";
import img3 from "../../assets/svgs/Vector3.svg";
import image from "../../assets/img1.png";
import { useSelector } from "react-redux";
import { app } from "../../firebase";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe(
  "pk_test_51RZ80x2NylYdi9wz9DoPllrBqNz9iG6euiHRg0TPv6Jqc6G1GtPgUBV5R6aXANG4ObggXzYo2hdk2i9KqwAm3LIV00XHoyQlBw"
);

const Payment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);
  const { selectedAddress } = useSelector((state) => state.address);
  const { selectedMethod, selectedDate } = useSelector(
    (state) => state.shipping
  );

  // Calculate order totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );
  const tax = subtotal * 0.1;
  const shippingCost = selectedMethod === "express" ? 8.5 : 0;
  const total = subtotal + tax + shippingCost;

  const db = getFirestore(app);

  const createOrder = async (paymentStatus) => {
    try {
      const collectionRef = collection(db, "orders");
      const orderData = {
        products: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: Number(item.price),
          quantity: Number(item.quantity),
          image: item.image,
          flavor: item.flavor,
          nicotineStrength: item.nicotineStrength,
          puffCount: item.puffCount
        })),
        address: {
          title: selectedAddress?.title,
          type: selectedAddress?.type,
          address: selectedAddress?.address,
          phone: selectedAddress?.phone
        },
        shipping: {
          method: selectedMethod,
          date: selectedDate,
          cost: shippingCost
        },
        totals: {
          subtotal: subtotal,
          tax: tax,
          total: total
        },
        userId: user?.uid?.uid || user?.uid,
        paymentStatus: paymentStatus,
        createdAt: new Date(),
        status: "pending"
      };
      const docRef = await addDoc(collectionRef, orderData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  };

  const validateCart = () => {
    if (!selectedAddress) {
      setError("Please select a shipping address");
      return false;
    }

    if (!cartItems || cartItems.length === 0) {
      setError("Your cart is empty");
      return false;
    }

    for (const item of cartItems) {
      if (!item.name || typeof item.name !== 'string') {
        setError(`Invalid product name for item: ${item.id}`);
        return false;
      }
      if (!item.price || isNaN(item.price)) {
        setError(`Invalid price for ${item.name}`);
        return false;
      }
    }

    return true;
  };
  console.log(cartItems)
  const handlePayment = async () => {
    if (!validateCart()) return;

    setLoading(true);
    setError(null);

    try {
      // 1. Create order in database first
      const orderId = await createOrder("pending");
      
      // 2. Create Stripe checkout session
      const stripe = await stripePromise;
      
       const response = await axios.post(
        'https://vapours-strip.vercel.app/api/stripe',
        {
            products: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                poster: item.image,
                // Create a meaningful description from available fields
                description: [
                    item.flavor,
                    item.nicotineStrength && `${item.nicotineStrength}mg`,
                    item.puffCount && `${item.puffCount} puffs`
                ].filter(Boolean).join(' | ') || undefined // Remove if empty
            })),
            orderId,
            customerEmail: user?.email || ""
        },
        {
          headers: { 
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      // 3. Redirect to Stripe checkout
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: response.data.id
      });

      if (stripeError) throw stripeError;
      
    } catch (error) {
      console.error("Payment Error:", error);
      
      let errorMessage = "Payment failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || 
                      error.response.data.error || 
                      errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-main-container">
      <div className="adress-steps-main-container">
        <div className="address-box">
          <div className="address-logo">
            <img src={img} alt="Step 1" />
          </div>
          <div className="step-address">
            <p>Step 1</p>
            <span>Address</span>
          </div>
        </div>
        <div className="address-box">
          <div className="address-logo">
            <img src={img2} alt="Step 2" />
          </div>
          <div className="step-address">
            <p>Step 2</p>
            <span>Shipping</span>
          </div>
        </div>
        <div className="address-box active-step">
          <div className="address-logo">
            <img src={img3} alt="Step 3" />
          </div>
          <div className="step-address">
            <p>Step 3</p>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="payment-content-container">
        <div className="order-summary-container">
          <h2 className="summary-heading">Order Summary</h2>
          
          <div className="products-list">
            {cartItems.map((item) => (
              <div className="product-item" key={`${item.id}-${item.flavor}`}>
                <div className="product-image">
                  <img 
                    src={item.image || image} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = image;
                      e.target.alt = "Default product image";
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3 className="product-name">{item.name}</h3>
                  <div className="product-specs">
                    {item.flavor && <span>Flavor: {item.flavor}</span>}
                    {item.nicotineStrength && (
                      <span>Nicotine: {item.nicotineStrength}</span>
                    )}
                    {item.puffCount && <span>Puffs: {item.puffCount}</span>}
                    <span>Qty: {item.quantity}</span>
                  </div>
                </div>
                <div className="product-price">
                  ${((Number(item.price) || 0) * (Number(item.quantity) || 1).toFixed(2))}
                </div>
              </div>
            ))}
          </div>

          <div className="order-details">
            <div className="shipping-info">
              <h3>Shipping Information</h3>
              {selectedAddress ? (
                <div className="address-info">
                  <p>
                    <strong>{selectedAddress.title}</strong> ({selectedAddress.type})
                  </p>
                  <p>{selectedAddress.address}</p>
                  <p>Phone: {selectedAddress.phone}</p>
                </div>
              ) : (
                <p className="error-text">No address selected</p>
              )}
              <div className="shipping-method">
                <p>
                  <strong>Shipping Method:</strong>{" "}
                  {selectedMethod === "free" && "Free Shipping"}
                  {selectedMethod === "express" && "Express Shipping ($8.50)"}
                  {selectedMethod === "schedule" && "Scheduled Delivery"}
                  {selectedDate && ` - ${selectedDate}`}
                </p>
              </div>
            </div>

            <div className="order-totals">
              <h3>Order Total</h3>
              <div className="total-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Estimated Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping & Handling</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="payment-actions">
            <button 
              className="back-button"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Back to Shipping
            </button>
            <button 
              className="pay-now-button" 
              onClick={handlePayment}
              disabled={loading || !selectedAddress || cartItems.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Processing...
                </>
              ) : (
                `Pay Securely $${total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;