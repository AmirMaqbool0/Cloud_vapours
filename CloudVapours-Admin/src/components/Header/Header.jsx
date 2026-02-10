import React from 'react';
import User from '../../assets/user.png'
import './style.css';

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-left">
       <span>WellcomeBack  to the admin panel of Cloud Vapours</span>
      </div>
      
      <div className="header-right">
        {/* <div className="notification-bell">
          <FiBell className="bell-icon" />
          <span className="notification-badge">3</span>
        </div> */}
        
        <div className="user-profile">
          <div className="profile-avatar">
            <img src={User} alt="User" className="avatar-img" />
          </div>
          <div className="profile-info">
            <span className="profile-name">John Doe</span>
            <span className="profile-role">Admin</span>
          </div>
          {/* <FiChevronDown className="dropdown-icon" /> */}
        </div>
      </div>
    </header>
  );
}

export default Header;