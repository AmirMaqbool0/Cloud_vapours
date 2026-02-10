import React, { useState } from "react";
import "./style.css";
import { Heart, Search, ShoppingBag, User, AlignRight, X, LogOut } from "lucide-react";
import Logo from '../../assets/logo.png';
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const closeSidebar = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log('User signed out');
        navigate('/signin'); 
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  };

  return (
    <>
      <div className="header-container">
        <div className="logo">
          <img src={Logo} alt="Logo" />
        </div>
        <div className="search">
          <Search color="#989898" />
          <input type="text" placeholder="search" />
        </div>
        <div className="links">
          <NavLink to={'/'} style={{ textDecoration: 'none' }}> <span>Home</span> </NavLink>
          <NavLink to={'/about'} style={{ textDecoration: 'none' }}> <span>About</span> </NavLink>
          <NavLink to={'/'} style={{ textDecoration: 'none' }}> <span>Blogs</span> </NavLink>
          <NavLink to={'/contactus'} style={{ textDecoration: 'none' }}> <span>Contact us</span> </NavLink>
        </div>
        <div className="header-icons">
          <NavLink to={'/cart'} style={{ textDecoration: 'none' }}>
            <ShoppingBag color="black" size={30} className="i" />
          </NavLink>
          <div style={{ marginTop: '5px', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut />
          </div>
          <div className="allien" onClick={toggleSidebar}>
            <AlignRight size={26} />
          </div>
        </div>
      </div>

      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <X size={24} onClick={closeSidebar} className="close-icon" />
        </div>
        <nav className="sidebar-links">
          <NavLink to="/" onClick={closeSidebar}>Home</NavLink>
          <NavLink to="/about" onClick={closeSidebar}>About</NavLink>
          <NavLink to="/" onClick={closeSidebar}>Blogs</NavLink>
          <NavLink to="/contactus" onClick={closeSidebar}>Contact us</NavLink>
          <NavLink to="/cart" onClick={closeSidebar}>Cart</NavLink>
        </nav>
      </div>
    </>
  );
};

export default Header;
