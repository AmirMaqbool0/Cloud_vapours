import React, { useState } from "react";
import "./style.css";
import img from "../../assets/svgs/Vector.svg";
import img2 from "../../assets/svgs/Vector2.svg";
import img3 from "../../assets/svgs/Vector3.svg";
import { Pencil, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addAddress, removeAddress, selectAddress } from "../../redux/addressSlice";
import { useNavigate } from "react-router-dom";

const Address = () => {
  const dispatch = useDispatch();
  const { addresses, selectedAddress } = useSelector((state) => state.address);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    id: "",
    title: "",
    type: "HOME",
    address: "",
    phone: "",
  });
  const navigation = useNavigate()
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAddress({
      ...currentAddress,
      [name]: value,
    });
  };

  const handleAddNewClick = () => {
    setIsEditing(false);
    setCurrentAddress({
      id: "",
      title: "",
      type: "HOME",
      address: "",
      phone: "",
    });
    setIsPopupOpen(true);
  };

  const handleEditClick = (address) => {
    setIsEditing(true);
    setCurrentAddress(address);
    setIsPopupOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const addressToSave = {
      ...currentAddress,
      id: isEditing ? currentAddress.id : Date.now(),
    };

    if (isEditing) {
      // In a real app, you would dispatch an update action here
      // For now, we'll just remove and add to simulate update
      dispatch(removeAddress(currentAddress.id));
      dispatch(addAddress(addressToSave));
    } else {
      dispatch(addAddress(addressToSave));
    }

    setIsPopupOpen(false);
  };

  const handleRemoveAddress = (id, e) => {
    e.stopPropagation();
    dispatch(removeAddress(id));
  };
 
  const Go_Next = () =>{
    navigation('/cart-shipping')
  }
  return (
    <div className="address-main-page">
      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="address-popup-overlay">
          <div className="address-popup">
            <button 
              className="popup-close-btn" 
              onClick={() => setIsPopupOpen(false)}
            >
              <X size={20} />
            </button>
            <h3>{isEditing ? "Edit Address" : "Add New Address"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title (e.g., Home, Office)</label>
                <input
                  type="text"
                  name="title"
                  value={currentAddress.title}
                  onChange={handleInputChange}
                  required
                  placeholder="My Home"
                />
              </div>
              <div className="form-group">
                <label>Address Type</label>
                <select
                  name="type"
                  value={currentAddress.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="HOME">Home</option>
                  <option value="OFFICE">Office</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <textarea
                  name="address"
                  value={currentAddress.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street, City, State, ZIP Code"
                  rows="4"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={currentAddress.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+1 (123) 456-7890"
                />
              </div>
              <button type="submit" className="btn btn-black">
                {isEditing ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* === Step Progress Bar === */}
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

      {/* === Address Cards and Actions === */}
      <div className="address-section-container">
        {/* Render address cards dynamically */}
        {addresses.map((addr) => (
          <div 
            className={`address-card ${selectedAddress?.id === addr.id ? 'selected' : ''}`} 
            key={addr.id}
            onClick={() => dispatch(selectAddress(addr))}
          >
            <div className="address-left">
              <input
                type="radio"
                name="address"
                className="address-radio"
                checked={selectedAddress?.id === addr.id}
                onChange={() => dispatch(selectAddress(addr))}
              />
              <div className="address-details">
                <div className="address-title">
                  {addr.title} <span className="address-tag">{addr.type}</span>
                  {addr.isDefault && <span className="address-tag default-tag">DEFAULT</span>}
                </div>
                <div className="address-text">{addr.address}</div>
                <div className="address-text">{addr.phone}</div>
              </div>
            </div>
            <div className="address-actions">
              <Pencil 
                size="20" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(addr);
                }} 
              />
              <X 
                onClick={(e) => handleRemoveAddress(addr.id, e)} 
              />
            </div>
          </div>
        ))}

        {/* Add New Address */}
        <div 
          className="add-address-section" 
          onClick={handleAddNewClick}
        >
          <div className="add-divider">
            <div className="add-divider-line" />
            <div className="add-icon-circle">+</div>
            <div className="add-divider-line" />
          </div>
          <div className="add-new-text">Add New Address</div>
        </div>

        {/* Buttons */}
        <div className="bottom-buttons">
          <button className="btn">Back</button>
          <button 
            className="btn btn-black"
            disabled={!selectedAddress}
            onClick={Go_Next}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Address;