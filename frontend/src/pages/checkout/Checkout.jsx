import React, { useState, useEffect } from "react";
import { fetchDataFromApi, postData } from "../../utils/api";
import "./Checkout.css";

const Checkout = () => {
  const [countries, setCountries] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [formfields, setFormfields] = useState({
    fullname: "",
    country: "INDIA",
    streetAddressLine1: "",
    streetAddressLine2: "",
    state: "",
    city: "",
    zipcode: "",
    phone: "",
    email: "",
  });

useEffect(() => {
  fetchDataFromApi("/cart")
    .then((res) => {
      console.log("Cart API Response:", res);
      const cartArray = Array.isArray(res)
        ? res
        : Array.isArray(res.cart)
        ? res.cart
        : [];
      console.log("Final cart array:", cartArray);
      setCartData(cartArray);
    })
    .catch(() => setCartData([]));
}, []);



  const onChangeInput = (e) => {
    setFormfields({ ...formfields, [e.target.name]: e.target.value });
  };
const handleCheckout = async () => {
  // Validation: check if all required fields are filled
  const requiredFields = ["fullname", "streetAddressLine1", "state", "city", "zipcode", "phone", "email"];
  const emptyFields = requiredFields.filter((field) => !formfields[field]?.trim());

  if (emptyFields.length > 0) {
    alert("⚠️ Please fill in all billing details before proceeding to checkout.");
    return;
  }

  if (cartData.length === 0) {
    alert(" Your cart is empty. Add items before checking out.");
    return;
  }

  try {
    const total =
      cartData.length !== 0
        ? cartData
            .map((item) => parseInt(item.productId?.price) * item.quantity)
            .reduce((total, value) => total + value, 0)
        : 0;

    const orderData = await postData("/payment/order", {
      amount: Math.round(total),
    });
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
        name: formfields.fullname,
        email: formfields.email,
        contact: formfields.phone,
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


  return (
    <section className="checkout-section">
      <div className="container">
        <form className="checkout-form">
          <div className="checkout-grid">
            {/* BILLING DETAILS */}
            <div className="billing-section">
              <h5 className="section-title">Billing Details</h5>

              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  name="fullname"
                  value={formfields.fullname}
                  onChange={onChangeInput}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <select
                  name="country"
                  value={formfields.country}
                  onChange={onChangeInput}
                >
                  {countries.length > 0 ? (
                    countries.map((c) => (
                      <option key={c.alpha2Code} value={c.name}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option value="INDIA">INDIA</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="streetAddressLine1"
                  onChange={onChangeInput}
                  placeholder="House number and street name"
                />
                <input
                  type="text"
                  name="streetAddressLine2"
                  onChange={onChangeInput}
                  placeholder="Apartment, suite, etc. (optional)"
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  onChange={onChangeInput}
                  placeholder="Enter your state"
                />
              </div>

              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  onChange={onChangeInput}
                  placeholder="Enter your city"
                />
              </div>

              <div className="form-group">
                <label>Zipcode *</label>
                <input
                  type="text"
                  name="zipcode"
                  onChange={onChangeInput}
                  placeholder="Enter zipcode"
                />
              </div>

              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="text"
                  name="phone"
                  onChange={onChangeInput}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  onChange={onChangeInput}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="order-summary">
              <h5 className="section-title">Your Order</h5>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
      <tbody>
  {cartData?.length > 0 ? (
    cartData.map((item, index) => (
      <tr key={index}>
        <td>
          <img
            src={item.productId?.images?.[0]}
            alt={item.productId?.name}
            height="50"
            width="50"
          />
        </td>
        <td>
         {item.productId?.name
  ?.split(" ")
  .slice(0, 2)
  .join(" ") + (item.productId?.name?.split(" ").length > 2 ? "..." : "")} × {item.quantity}

        </td>
        <td>₹ {item.productId?.price}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="3" className="empty-cart">
        No items in cart
      </td>
    </tr>
  )}
  <tr>
    <td colSpan="2">Total</td>
    <td>
      ₹
      {cartData.length !== 0
        ? cartData
            .map((item) => parseInt(item.productId?.price) * item.quantity)
            .reduce((a, b) => a + b, 0)
        : 0}
    </td>
  </tr>
     </tbody>

              </table>

              <button
                type="button"
                className="checkout2-btn"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    Processing Checkout...
                    <span className="spinner"></span>
                  </>
                ) : (
                  <>
                    Checkout 
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
