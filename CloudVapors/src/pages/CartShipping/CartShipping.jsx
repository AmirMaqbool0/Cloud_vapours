import React, { useState } from 'react';
import './style.css';
import img from '../../assets/svgs/Vector.svg';
import img2 from '../../assets/svgs/Vector2.svg';
import img3 from '../../assets/svgs/Vector3.svg';
import { Pencil, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { selectShippingMethod, calculateDeliveryDate } from '../../redux/shippingSlice';
import { useNavigate } from 'react-router-dom';

const CartShipping = () => {
  const dispatch = useDispatch();
  const { selectedMethod, shippingOptions } = useSelector((state) => state.shipping);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedScheduleDate, setSelectedScheduleDate] = useState(null);
 const navigation = useNavigate()
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 30);  

  const handleMethodSelect = (methodId) => {
    if (methodId === 'schedule') {
      setShowDatePicker(true);
    } else {
      const method = shippingOptions.find(opt => opt.id === methodId) || 
        { id: 'schedule', price: 0, deliveryDays: 0 };
      const deliveryDate = calculateDeliveryDate(method.deliveryDays);
      dispatch(selectShippingMethod({
        method: methodId,
        date: deliveryDate
      }));
      setShowDatePicker(false);
    }
  };

  const handleDateSelect = (date) => {
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    setSelectedScheduleDate(formattedDate);
    dispatch(selectShippingMethod({
      method: 'schedule',
      date: formattedDate
    }));
    setShowDatePicker(false);
  };

  const renderDateOptions = () => {
    const dates = [];
    for (let i = 1; i <= 15; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(
        <div 
          key={i}
          className={`date-option ${selectedScheduleDate === date.toLocaleDateString() ? 'selected' : ''}`}
          onClick={() => handleDateSelect(date)}
        >
          {date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      );
    }
    return dates;
  };
  
  const Go_Next = () => {
    navigation('/payment')
  }
  return (
    <div className="cart-shipping-main-container">
      <div className="adress-steps-main-container">
        <div className="address-box">
          <div className="address-logo">
            <img src={img} alt="" />
          </div>
          <div className="step-address">
            <p>Step 1</p>
            <span>Address</span>
          </div>
        </div>

        <div className="address-box">
          <div className="address-logo">
            <img src={img2} alt="" />
          </div>
          <div className="step-address">
            <p>Step 2</p>
            <span>Shipping</span>
          </div>
        </div>

        <div className="address-box">
          <div className="address-logo">
            <img src={img3} alt="" />
          </div>
          <div className="step-address">
            <p>Step 3</p>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="shipment-method-section">
        <h4>Shipment Method</h4>
        <div className="shipment-options">
          {shippingOptions.map((option) => (
            <div 
              key={option.id}
              className={`shipment-option ${selectedMethod === option.id ? 'selected' : ''}`}
              onClick={() => handleMethodSelect(option.id)}
            >
              <div className="left-section">
                <input 
                  type="radio" 
                  name="shipment" 
                  checked={selectedMethod === option.id}
                  readOnly
                />
                <div className="shipment-details">
                  <strong>
                    {option.price > 0 ? `$${option.price.toFixed(2)}` : 'Free'}
                  </strong>
                  <span>{option.description}</span>
                </div>
              </div>
              <div className="right-section">
                {calculateDeliveryDate(option.deliveryDays)}
              </div>
            </div>
          ))}

          {/* Schedule Option */}
          <div 
            className={`shipment-option ${selectedMethod === 'schedule' ? 'selected' : ''}`}
            onClick={() => handleMethodSelect('schedule')}
          >
            <div className="left-section">
              <input 
                type="radio" 
                name="shipment" 
                checked={selectedMethod === 'schedule'}
                readOnly
              />
              <div className="shipment-details">
                <strong>Schedule</strong>
                <span>Pick a date when you want to get your delivery</span>
              </div>
            </div>
            <div className="right-section">
              {selectedScheduleDate || 'Select Date ▼'}
            </div>
          </div>

          {/* Date Picker */}
          {showDatePicker && (
            <div className="date-picker-popup">
              <div className="date-picker-header">
                <h5>Select Delivery Date</h5>
                <button onClick={() => setShowDatePicker(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="date-options-container">
                {renderDateOptions()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shipping-buttons">
        <button className="back-btn">Back</button>
        <button 
          className="next-btn"
          disabled={!selectedMethod}
          onClick={Go_Next}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CartShipping;