import React from 'react'
import './style.css'

const ResetPassword = () => {
  return (
    <div>

         <div className="reset-password-container">
      <div className="reset-password-top-bg"></div>
      <div className="reset-password-bottom-bg"></div>

      <div className="reset-password-card">
        <div className="reset-password-header">
          <span className="reset-password-title">Reset Password</span>
          <p className="reset-password-description">
           Enter your password to unlock your account!
          </p>
        </div>

        <div className="reset-password-input-group">
          <span className="reset-password-label">New Password*</span>
          <input
            type="Password"
            placeholder="Your account password"
            className="reset-password-input"
          />
        </div>

        <div className="reset-password-button-group">
          <button className="reset-password-button">Reset Password</button>
        </div>
      </div>
    </div>
      
    </div>
  )
}

export default ResetPassword
