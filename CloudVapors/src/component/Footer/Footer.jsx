import React from 'react'
import './style.css'
import logo from '../../assets/logo.png'
import s1 from '../../assets/svgs/s1.svg'
import s2 from '../../assets/svgs/s2.svg'
import s3 from '../../assets/svgs/s3.svg'
import s4 from '../../assets/svgs/instagram.svg'
const Footer = () => {
  return (
   <div className="footer-main-cotainer">
    <div className="footer-left-container">
        <div className="footer-logo">
            <img src={logo} alt="" />
        </div>
        <div className="footer-text">
            <span>We are a residential interior design firm located in Portland. Our boutique-studio offers more than</span>
        </div>

        <div className="footer-soical-icons">
                <img src={s3} alt="" />
               <img src={s1} alt="" />
              <img src={s2} alt="" />
         
          
        
            <img src={s4} alt="" />
        </div>

    </div>
    <div className="footer-right-container">
        <div className="right-footer-items">
            <span>Services</span>
            <p>Bonus program</p>
            <p>Gift Cards</p>
            <p> Credit and Payments</p>
            <p>Service and Contracts</p>
            <p> Non-Cash Account</p>
            <p>Payment</p>
        </div>
              <div className="right-footer-items">
            <span>Assistance to the buyer</span>
            <p>Find an Order</p>
            <p>Terms of Delivery</p>
            <p> Exchange and retuen of goods</p>
            <p>Guarantee</p>
            <p>Frequently asked Questions</p>
            <p>Terms of use of the site</p>
        </div>

    </div>

   </div>
  )
}

export default Footer
