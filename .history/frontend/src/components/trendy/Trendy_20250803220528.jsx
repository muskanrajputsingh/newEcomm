import { ShoppingCart } from "lucide-react"
import "./Trendy.css"
import { useEffect,useState } from "react"
import { fetchDataFromApi,postData } from "../../utils/api"
import { Link } from "react-router-dom"

const Trendy = () => {
  const [trendyProducts, setTrendyProducts] = useState([]);

  useEffect(()=>{
    fetchDataFromApi("/trendy")
    .then((res)=>{
      console.log("trendy product",res);

    if(!res || !res.products || res.products.length===0){
      console.log("No Trendy Products found.");
      setTrendyProducts([]);
    }else{
      setTrendyProducts(res.products)
    }
    })
    .catch((err)=>console.error("Error fetching trendy products:",err));
  },[]);

  const renderBadge = (badge) => {
    if (badge === "new") {
      return <div className="new-badge">New</div>
    } else if (badge === "popular") {
      return <div className="popular-badge">Popular</div>
    }
    return null
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

  

  return (
    <section className="products-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Trending Products</h2>
          <p className="section-subtitle">Discover what's popular right now</p>
        </div>

        <div className="products-grid">
        {trendyProducts.map((product) => (
           <Link to={`/productdetail/${product._id}`}>
            <div key={product.id} className="product-card1">
              <div className="card-header">
                {renderBadge(product.badge)}
                <div className="discount-badge">{product.discount}%</div>
              </div>

              <div className="product-image1">
                <img src={product.images || "/placeholder.svg"} alt={''} />
              </div>

              <div className="product-content">
                <h3 className="product-name">{product.name}</h3>

                <div className="product-footer">
                  <div className="product-price">
                    <span className="current-price">${product.price}</span>
                    <span className="original-price">${product.oldPrice}</span>
                  </div>
                  <button className="add-to-cart-btn"
                   onClick={(e) => {
                        e.preventDefault(); 
                        handleAddToCart(product._id);
                      }}
                    >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Trendy
