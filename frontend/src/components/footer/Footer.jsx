import {
    Facebook,
    Twitter,
    Instagram,
    Youtube,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Truck,
    Shield,
    Headphones,
  } from "lucide-react"
  import "./Footer.css"
  
  const Footer = () => {
    return (
      <footer className="footer">
        {/* Features Section */}
        <div className="features-bar">
          <div className="container">
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">
                  <Truck size={24} />
                </div>
                <div className="feature-content">
                  <h4>Free Shipping</h4>
                  <p>On orders over ₹50</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Shield size={24} />
                </div>
                <div className="feature-content">
                  <h4>Secure Payment</h4>
                  <p>100% secure transactions</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Headphones size={24} />
                </div>
                <div className="feature-content">
                  <h4>24/7 Support</h4>
                  <p>Dedicated customer service</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <CreditCard size={24} />
                </div>
                <div className="feature-content">
                  <h4>Easy Returns</h4>
                  <p>30-day return policy</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Main Footer */}
        <div className="footer-main">
          <div className="container">
            <div className="footer-grid">
              {/* Company Info */}
              <div className="footer-section">
                <div className="footer-logo">
                  <h3>ShopHub</h3>
                </div>
                <p className="footer-description">
                  Your one-stop destination for quality products at unbeatable prices. We're committed to providing
                  exceptional shopping experiences.
                </p>
                <div className="contact-info">
                  <div className="contact-item">
                    <MapPin size={16} />
                    <span>123 Shopping Street, NY 10001</span>
                  </div>
                  <div className="contact-item">
                    <Phone size={16} />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="contact-item">
                    <Mail size={16} />
                    <span>info@shophub.com</span>
                  </div>
                </div>
              </div>
  
              {/* Quick Links */}
              <div className="footer-section">
                <h4 className="footer-title">Quick Links</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#about">About Us</a>
                  </li>
                  <li>
                    <a href="#contact">Contact</a>
                  </li>
                  <li>
                    <a href="#careers">Careers</a>
                  </li>
                  <li>
                    <a href="#blog">Blog</a>
                  </li>
                  <li>
                    <a href="#press">Press</a>
                  </li>
                  <li>
                    <a href="#partnerships">Partnerships</a>
                  </li>
                </ul>
              </div>
  
              {/* Categories */}
              <div className="footer-section">
                <h4 className="footer-title">Categories</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#electronics">Electronics</a>
                  </li>
                  <li>
                    <a href="#fashion">Fashion</a>
                  </li>
                  <li>
                    <a href="#home">Home & Garden</a>
                  </li>
                  <li>
                    <a href="#sports">Sports</a>
                  </li>
                  <li>
                    <a href="#beauty">Beauty</a>
                  </li>
                  <li>
                    <a href="#books">Books</a>
                  </li>
                </ul>
              </div>
  
              {/* Customer Service */}
              <div className="footer-section">
                <h4 className="footer-title">Customer Service</h4>
                <ul className="footer-links">
                  <li>
                    <a href="#help">Help Center</a>
                  </li>
                  <li>
                    <a href="#shipping">Shipping Info</a>
                  </li>
                  <li>
                    <a href="#returns">Returns</a>
                  </li>
                  <li>
                    <a href="#size-guide">Size Guide</a>
                  </li>
                  <li>
                    <a href="#track">Track Order</a>
                  </li>
                  <li>
                    <a href="#faq">FAQ</a>
                  </li>
                </ul>
              </div>
  
              {/* Newsletter */}
              <div className="footer-section newsletter">
                <h4 className="footer-title">Stay Connected</h4>
                <p>Subscribe to get special offers, free giveaways, and updates.</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Enter your email" className="newsletter-input" />
                  <button className="newsletter-btn">Subscribe</button>
                </div>
                <div className="social-links">
                  <a href="#facebook" className="social-link">
                    <Facebook size={20} />
                  </a>
                  <a href="#twitter" className="social-link">
                    <Twitter size={20} />
                  </a>
                  <a href="#instagram" className="social-link">
                    <Instagram size={20} />
                  </a>
                  <a href="#youtube" className="social-link">
                    <Youtube size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <div className="footer-bottom-content">
              <div className="copyright">
                <p>&copy; 2024 ShopHub. All rights reserved.</p>
              </div>
              <div className="footer-bottom-links">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#cookies">Cookie Policy</a>
              </div>
              <div className="payment-methods">
                <span>We Accept:</span>
                <div className="payment-icons">
                  <div className="payment-icon">VISA</div>
                  <div className="payment-icon">MC</div>
                  <div className="payment-icon">AMEX</div>
                  <div className="payment-icon">PP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  