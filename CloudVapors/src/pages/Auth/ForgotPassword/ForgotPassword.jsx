import React from 'react';
import './style.css'; 

const ForgotPassword = () => {
  return (
    <div className="forgot-page-container">
      <div className="forgot-top-bg"></div>
      <div className="forgot-bottom-bg"></div>

      <div className="forgot-card">
        <div className="forgot-header">
          <span className="forgot-title">Forgot Password?</span>
          <p className="forgot-description">
            No problem. Just let us know your email address and we’ll email you a password reset link that will allow you to choose a new one.
          </p>
        </div>

        <div className="forgot-input-group">
          <span className="forgot-label">Email*</span>
          <input type="email" placeholder="mail@simmrple.com" className="forgot-input" />
        </div>

        <div className="forgot-button-group">
          <button className="forgot-submit-button">Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
