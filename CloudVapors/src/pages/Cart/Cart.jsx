import React from 'react';
import './style.css';
import { Minus, Plus, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart
} from '../../redux/cartSlice';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };
 
   const navigation = useNavigate() 

  const handleCheckout = () => {
    alert('Order placed successfully!');
     navigation('/cart-address')
  };

  const handleWhatsAppOrder = () => {
    if (cartItems.length === 0) return;

    let message = '🛒 *New Order Request*%0A--------------------%0A';

    cartItems.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*%0A`;
      message += `Flavor: ${item.flavor}%0A`;
      message += `Nicotine: ${item.nicotineStrength}%0A`;
      message += `Qty: ${item.quantity}%0A`;
      message += `Price: $${(item.price * item.quantity).toFixed(2)}%0A--------------------%0A`;
    });

    const subtotal = getSubtotal().toFixed(2);
    const tax = 5.0;
    const total = (parseFloat(subtotal) + tax).toFixed(2);

    message += `*Subtotal:* $${subtotal}%0A`;
    message += `*Tax:* $${tax.toFixed(2)}%0A`;
    message += `*Total:* $${total}%0A`;
    message += `%0A🛍️ *Thank you for shopping with us!*`;

    const phoneNumber = '923083710811';
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };

  return (
    <div className="cart-main-page">
      <div className="cart-main-left-container">
        <div className="shopping-cart-heading">
          <span>Shopping Cart</span>
        </div>

        {cartItems.length === 0 ? (
          <p className="empty-cart-msg">Your cart is empty</p>
        ) : (
          cartItems.map((item, i) => (
            <div className="cart-box-main-container" key={i}>
              <div className="cart-box">
                <div className="product-image">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="cart-page-product-name">
                  <span>{item.name}</span>
                </div>

                <div className="add-remove-cart-page">
                  <div
                    className="minus"
                    onClick={() =>
                      dispatch(
                        decreaseQuantity({
                          id: item.id,
                          flavor: item.flavor,
                          nicotineStrength: item.nicotineStrength
                        })
                      )
                    }
                  >
                    <Minus size="22" />
                  </div>
                  <div className="count">
                    <span>{item.quantity}</span>
                  </div>
                  <div
                    className="plus"
                    onClick={() =>
                      dispatch(
                        increaseQuantity({
                          id: item.id,
                          flavor: item.flavor,
                          nicotineStrength: item.nicotineStrength
                        })
                      )
                    }
                  >
                    <Plus size="22" />
                  </div>
                </div>

                <div className="cart-product-price">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <div
                  className="cart-page-cross"
                  onClick={() =>
                    dispatch(
                      removeFromCart({
                        id: item.id,
                        flavor: item.flavor,
                        nicotineStrength: item.nicotineStrength
                      })
                    )
                  }
                >
                  <X />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-right-main-container">
        <div className="cart-old-summary">
          <span>Order Summary</span>
        </div>

        <div className="subtotal-texes-main">
          <div className="subtotal">
            <span>Subtotal</span>
            <p>${getSubtotal().toFixed(2)}</p>
          </div>
          <div className="cart-product-tex">
            <span>Estimated Tax</span>
            <p>$5.00</p>
          </div>
          <div className="subtotal">
            <span>Total</span>
            <p>${(getSubtotal() + 5).toFixed(2)}</p>
          </div>
        </div>

        <div className="cart-buttons-main">
          <div className="check-out-button">
            <button onClick={handleCheckout} >
              Checkout
            </button>
          </div>
          <div className="open-on-whatsapp-button">
            <button onClick={handleWhatsAppOrder} disabled={cartItems.length === 0}>
              Order Through WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
