import { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaTrashAlt,
  FaPlus,
  FaMinus,
  FaTimes,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcPaypal,
  FaCcApplePay,
} from "react-icons/fa";
import "./Cart.css";
import { fetchDataFromApi, editData, deleteData,postData } from "@/utils/api";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await fetchDataFromApi("/cart");
        setCartItems(data.cart || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, change) => {
    const item = cartItems.find((item) => item.productId._id === productId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);

    try {
      await editData(`/cart/${productId}`, { quantity: newQty });
      setCartItems((prev) =>
        prev.map((item) =>
          item.productId._id === productId ? { ...item, quantity: newQty } : item
        )
      );
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  const availableCoupons = [
    { code: "SUMMER25", discount: 0.25, type: "percentage" },
    { code: "SAVE10", discount: 10, type: "fixed" },
  ];

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 100 ? 0 : 10.99;
  const tax = subtotal * 0.08;

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    return appliedCoupon.type === "percentage"
      ? subtotal * appliedCoupon.discount
      : appliedCoupon.discount;
  };

  const discount = calculateDiscount();
  const total = subtotal + shipping + tax - discount;

  const handleRemoveItem = async (productId) => {
    try {
      await deleteData(`/cart/${productId}`);
      setCartItems((prev) => prev.filter((item) => item.productId._id !== productId));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleApplyCoupon = () => {
    const coupon = availableCoupons.find(
      (c) => c.code.toLowerCase() === couponCode.toLowerCase()
    );
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponCode("");
    } else {
      alert("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  const formatPrice = (price) => `₹${price.toFixed(2)}`;

const handleCheckout = async () => {
  try {
    const orderData = await postData("/payment/order", { amount: Math.round(total) });
    const order = orderData.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Purple Hub",
      description: "E-commerce Payment",
      order_id: order.id,
      handler: async (response) => {
        const verifyRes = await postData("/payment/verify", {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });

        if (verifyRes.message === "Payment Successful") {
          alert("✅ Payment Successful!");
        } else {
          alert("❌ Payment verification failed!");
        }
      },
      prefill: {
        name: "Muskan Singh",
        email: "muskansingh7105@gmail.com",
        contact: "9770626211",
      },
      theme: {
        color: "#f8e4f8",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  } catch (error) {
    console.error("Error in payment:", error);
    alert("Something went wrong during checkout!");
  }
};

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="loading-cart">
            <div className="spinner"></div>
            <p>Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
           <Link to="/"> <button className="continue-shopping-btn">Continue Shopping</button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1 className="cart-title">MY CART</h1>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-header">
              <span className="header-product">Product</span>
              <span className="header-price">Price</span>
              <span className="header-quantity">Quantity</span>
              <span className="header-total">Total</span>
            </div>

            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <div className="item-product">
                  <img
                    src={item.productId.images?.[0] || "/placeholder.svg"}
                    alt={item.productId.name}
                  />
                  <div className="item-details">
                    <h3>{item.productId.name}</h3>
                    <div className="item-meta">
                      <span>Color: {item.productId.color || "N/A"}</span>
                      <span>Size: {item.productId.size || "N/A"}</span>
                    </div>
                    <button
                      className="remove-item"
                      onClick={() => handleRemoveItem(item.productId._id)}
                    >
                      <FaTrashAlt /> Remove
                    </button>
                  </div>
                </div>

                <div className="item-price">{formatPrice(item.productId.price)}</div>

                <div className="item-quantity">
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId._id, 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div className="item-total">
                  {formatPrice(item.productId.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>

            {appliedCoupon && (
              <div className="summary-row discount">
                <span>
                  Discount ({appliedCoupon.type === "percentage"
                    ? `${appliedCoupon.discount * 100}%`
                    : "Coupon"}
                  )
                  <button className="remove-coupon" onClick={handleRemoveCoupon}>
                    <FaTimes />
                  </button>
                </span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}

            <div className="coupon-section">
              <input
                type="text"
                placeholder="Promo code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button
                className="apply-coupon"
                onClick={handleApplyCoupon}
                disabled={!couponCode}
              >
                Apply
              </button>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <div className="payment-methods">
              <p>We Accept:</p>
              <div className="payment-icons">
                <FaCcVisa />
                <FaCcMastercard />
                <FaCcAmex />
                <FaCcPaypal />
                <FaCcApplePay />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
