import { useRef ,useState,useEffect} from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight, Star, Heart, ShoppingCart } from "lucide-react"
import { fetchDataFromApi,postData } from "../../utils/api"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./Featured.css"
import { Link } from "react-router-dom"
import { toast } from 'react-toastify';

const Featured = () => {
  const swiperRef = useRef(null)
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  useEffect(() => {
    fetchDataFromApi("/featured")
      .then((res) => {
        console.log("Featured Products Response:", res);
  
        if (!res || !res.products || res.products.length === 0) {
          console.error("No featured products found.");
          setFeaturedProducts([]);
        } else {
          setFeaturedProducts(res.products);
        }
      })
      .catch((err) => console.error("Error fetching featured products:", err));
  }, []);

  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} size={14} className={index < Math.floor(rating) ? "star filled" : "star"} />
    ))
  }


const handleAddToCart = async (productId) => {
  try {
    const data = await postData('/cart', { productId, quantity: 1 });

    toast.success("🛒 Product added to cart!");
    console.log('Cart Response:', data);

  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    toast.error("❌ Failed to add to cart");
  }
};


  return (
    <section className="featured-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <p className="section-subtitle">Handpicked items just for you</p>
          <div className="navigation-buttons">
            <button className="nav-button prev" onClick={() => swiperRef.current?.slidePrev()}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-button next" onClick={() => swiperRef.current?.slideNext()}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="featured-swiper"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Link to={`/productdetail/${product._id}`}>
              <div className="product-card">
                <div className="card-header">
                  <div className="product-badge">{product.discount}%</div>
                  <div className="product-actions">
                    <button className="action-btn wishlist">
                      <Heart size={18} />
                    </button>
                  </div>
                </div>

                <div className="product-image">
                  <img src={product.images[0] || "/placeholder.svg"} alt={''} />
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>

                  <div className="product-rating">
                    <div className="stars">{renderStars(product.rating)}</div>
                    <span className="rating-text">({product.rating})</span>
                  </div>

                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    {product.price && <span className="original-price">${product.oldPrice}</span>}
                  </div>

                 <button
                      className="add-to-cart"
                      onClick={(e) => {
                        e.preventDefault(); 
                        handleAddToCart(product._id);
                      }}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>

                </div>
              </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Featured
