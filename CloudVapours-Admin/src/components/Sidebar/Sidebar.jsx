import React from "react";
import {
  FiBox,
  FiShoppingBag,
  FiFileText,
  FiMessageSquare,
  FiList,
  FiLogOut,
} from "react-icons/fi";
import "./style.css";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../firebase";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Admin Panel</h2>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-items">
          <NavLink to={"/"} style={{ textDecoration: "none" }}>
            <li className="nav-item">
              <FiBox className="nav-icon" />
              <span className="nav-text">Devices</span>
            </li>
          </NavLink>
          <NavLink to={"/products"} style={{ textDecoration: "none" }}>
            <li className="nav-item">
              <FiShoppingBag className="nav-icon" />
              <span className="nav-text">Products</span>
            </li>
          </NavLink>
          <NavLink to={"/blogs"} style={{ textDecoration: "none" }}>
            <li className="nav-item">
              <FiFileText className="nav-icon" />
              <span className="nav-text">Blogs</span>
            </li>
          </NavLink>
          <NavLink to={"/messages"} style={{ textDecoration: "none" }}>
            <li className="nav-item">
              <FiMessageSquare className="nav-icon" />
              <span className="nav-text">Messages</span>
            </li>
          </NavLink>
          <NavLink to={"/orders"} style={{ textDecoration: "none" }}>
            <li className="nav-item">
              <FiList className="nav-icon" />
              <span className="nav-text">Orders</span>
            </li>
          </NavLink>
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut className="logout-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
