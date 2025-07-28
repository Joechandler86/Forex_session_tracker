import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="text-gradient">Forex Session Tracker</h3>
            <p>Your smart companion for global Forex trading sessions</p>
            <div className="social-links">
              <a href="#" className="social-link">
                <FiGithub />
              </a>
              <a href="#" className="social-link">
                <FiTwitter />
              </a>
              <a href="#" className="social-link">
                <FiMail />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4>Features</h4>
            <ul>
              <li><Link to="/sessions">Session Clock</Link></li>
              <li><Link to="/trading">Trading Tools</Link></li>
              <li><Link to="/premium">Premium Features</Link></li>
              <li><Link to="/profile">User Profile</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Center</a></li>
              <li><a href="#">API Documentation</a></li>
              <li><a href="#">Contact Support</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Cookie Policy</a></li>
              <li><a href="#">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Forex Session Tracker. All rights reserved.</p>
          <p className="disclaimer">
            Risk Warning: Trading Forex involves substantial risk of loss and is not suitable for all investors.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;