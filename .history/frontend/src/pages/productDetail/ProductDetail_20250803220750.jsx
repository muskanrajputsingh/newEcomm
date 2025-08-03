import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay, Thumbs } from "swiper/modules"
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, Share2, Plus, Minus } from "lucide-react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/thumbs"
import "./ProductDetail.css" 
import { useParams } from "react-router-dom"
import { fetchDataFromApi,postData } from "@/utils/api"

 
const ProductDetail = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("M")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "", name: "" })
  const [activeTab, setActiveTab] = useState("reviews")
  const [products, setProducts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([]);


  const { id } = useParams() 

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        const response = await fetchDataFromApi(`/product/${id}`)
        if (response) {
          setProducts(response);
          if (response.size) setSelectedSize(response.size)
          setError(null)
          console.log("✅ Product fetched:", response)
        } else {
          setError("❌ Product not found")
        }
      } catch (err) {
        setError("❌ Error fetching product details")
        console.error("Error fetching product details:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProductDetails()
    }
  }, [id]) 
 
  const product = {
    reviewCount: 128,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    features: [
      "100% Premium Cotton Blend",
      "Pre-shrunk for perfect fit",
      "Reinforced seams for durability",
      "Machine washable",
      "Available in multiple colors",
    ],
    specifications: {
      Material: "60% Cotton, 40% Polyester",
      Weight: "180 GSM",
      Fit: "Regular Fit",
      Care: "Machine wash cold, tumble dry low",
      Origin: "Made in USA",
    },
  }
 
  const reviews = [
    {
      id: 1,
      name: "Sarah Khan",
      rating: 5,
      date: "2025-01-1",
      comment:
        "Absolutely love this t-shirt! The quality is exceptional and it fits perfectly. The fabric is so soft and comfortable.",
    },
    {
      id: 2,
      name: "Reena Verma",
      rating: 4,
      date: "2025-01-5",
      comment: "Great quality shirt. The color is exactly as shown in the pictures. Highly recommend!",
    },
  ]
 
  const handleQuantityChange = (type) => {
    if (type === "increment") {
      setQuantity((prev) => prev + 1)
    } else if (type === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddReview = (e) => {
    e.preventDefault()
    console.log("New review:", newReview)
    setNewReview({ rating: 5, comment: "", name: "" })
  }
 
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} className={`star ${index < rating ? "star-filled" : "star-empty"}`} />
    ))
  }

const handleAddToCart = async (productId) => {
  try {
    const data = await postData('/cart', { productId, quantity: 1 });

    alert('Product added to cart!');
    console.log('Cart Response:', data);

  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    alert('Failed to add to cart');
  }
};


useEffect(() => {
  const fetchRelated = async () => {
    console.log("product state:", products);

    const currentSubCatId = products?.subCat?._id; 
    if (!currentSubCatId) {
      console.log("No subcategory found in product");
      return;
    }

    try {
      const response = await fetchDataFromApi("/product?all=true"); 
      console.log("all products response:", response);

      if (response?.productList && Array.isArray(response.productList)) {
        const filtered = response.productList.filter(
          (p) =>
            p.subCat?._id === currentSubCatId && p._id !== id 
        );
        console.log("Filtered related products:", filtered);
        setRelatedProducts(filtered);
      } else {
        console.error("Invalid product list format");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  fetchRelated();
}, [products, id]);


 
  return (
    <div className="product2-container">
      <div className="product2-main">
        <div className="image-gallery">
          <Swiper
            modules={[Navigation, Pagination, Autoplay, Thumbs]}
            thumbs={{ swiper: thumbsSwiper }}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="main-swiper"
          >
           {products?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image || "/placeholder.svg"} alt={`${products.name} ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
 
          {/* Thumbnail Swiper */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress
            className="thumbs-swiper"
          >
            {products?.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <img src={image || "/placeholder.svg"} alt={`Thumbnail ${index + 1}`} className="thumb-slide" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
 
        {/* Product Info */}
        <div className="product2-info">
          <div>
            <h1 className="product2-title">{products?.name}</h1>
            <div className="rating-container">
              <div className="stars">
                {renderStars(Math.floor(products?.rating))}
                <span className="rating-text">
                  {products?.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="price2-container">
              <span className="current-price2">${products?.price}</span>
              <span className="original-price2">${products?.oldPrice}</span>
              <span className="savings-badge2">Save ${(products?.oldPrice - products?.price).toFixed(2)}</span>
            </div>
          </div>
 
          <p className="product2-description">{products?.description}</p>
 
         
          {/* Size Selection */}
          <div className="selection-group">
            <h3 className="selection-title">Size</h3>
            <div className="selection-options">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`selection-button ${selectedSize === size ? "active" : ""}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
 
          {/* Quantity */}
          <div className="selection-group">
            <h3 className="selection-title">Quantity</h3>
            <div className="quantity-container">
              <div className="quantity-selector">
                <button onClick={() => handleQuantityChange("decrement")} className="quantity-button">
                  <Minus size={16} />
                </button>
                <span className="quantity-display">{quantity}</span>
                <button onClick={() => handleQuantityChange("increment")} className="quantity-button">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
 
          {/* Action Buttons */}
          <div className="action-buttons">
            <div className="button-row">
              <button className="add-to-cart-btn3"
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleAddToCart(products._id);
                      }}
                    >
                <ShoppingCart size={20} />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`icon-button ${isWishlisted ? "active" : ""}`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
              <button className="icon-button">
                <Share2 size={20} />
              </button>
            </div>
          </div>
 
          {/* Features */}
          <div className="features2-grid">
            <div className="feature2-item">
              <Truck className="feature2-icon green" />
              <span className="feature2-text">Free Shipping</span>
            </div>
            <div className="feature2-item">
              <Shield className="feature2-icon blue" />
              <span className="feature2-text">2 Year Warranty</span>
            </div>
            <div className="feature2-item">
              <RotateCcw className="feature2-icon purple" />
              <span className="feature2-text">30 Day Returns</span>
            </div>
          </div>
        </div>
      </div>
 
      {/* Product Details Tabs */}
      <div className="tabs-container">
        <div className="tab-list">
          <button
            onClick={() => setActiveTab("description")}
            className={`tab-button ${activeTab === "description" ? "active" : ""}`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("specifications")}
            className={`tab-button ${activeTab === "specifications" ? "active" : ""}`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
          >
            Reviews ({product.reviewCount})
          </button>
        </div>
 
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === "description" && (
            <div className="description-content">
              <h3>Product Description</h3>
              <p>{products?.description}</p>
              <h4>Key Features</h4>
              <ul className="features-list">
                {product.features.map((feature, index) => (
                  <li key={index} className="feature-list-item">
                    <div className="feature-bullet"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
 
          {activeTab === "specifications" && (
            <div>
              <h3 className="selection-title">Specifications</h3>
              <div className="specifications-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <table>
                      <tr>
                        <td> <span className="spec-label">{key}:</span></td>
                        <td><span className="spec-value"> &nbsp; {value}</span></td>
                      </tr>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          )}
 
          {activeTab === "reviews" && (
            <div className="reviews-container">
              {/* Reviews List */}
              <div>
                <h3 className="selection-title">Customer Reviews</h3>
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <div className="review-author">
                          <span className="author-name">{review.name}</span>
                          <div className="stars">{renderStars(review.rating)}</div>
                        </div>
                        <span className="review-date">{review.date}</span>
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
 
              {/* Add Review Form */}
              <div className="review-form-container">
                <h4 className="review-form-title">Write a Review</h4>
                <form onSubmit={handleAddReview} className="review-form">
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      type="text"
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div className="rating-selector">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setNewReview({ ...newReview, rating: star })}>
                          <Star className={`rating-star ${star <= newReview.rating ? "star-filled" : "star-empty"}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Your Review</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="form-textarea"
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn">
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
 
        {/* Related Products */}
        <div className="related-products">
          <h2 className="related-title">Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="product2-card">
                <img
                  src={relatedProduct.images?.[0] || "/placeholder.svg"}
                  alt={relatedProduct.name}
                  className="product2-card-image"
                />
                <div className="product2-card-content">
                  <h3 className="product2-card-title">{relatedProduct.name}</h3>
                  <div className="product2-card-footer">
                    <span className="product2-card-price">${relatedProduct.price}</span>
                    <div className="product2-card-rating">
                      {renderStars(Math.floor(relatedProduct.rating))}
                      <span className="rating-number">({relatedProduct.rating})</span>
                    </div>
                  </div>
                  <button className="view-product2-btn">View Product</button>
                </div>
              </div>
            ))}
          </div>
        </div>

    </div>
  )
}
 
export default ProductDetail
 