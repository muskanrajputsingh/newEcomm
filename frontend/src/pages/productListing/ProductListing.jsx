import { useState, useEffect } from "react";
import {
  Heart,
  ShoppingBag,
  Grid,
  List,
  Sliders,
  ChevronDown,
  Star,
  X,
} from "lucide-react";
import "./ProductListing.css";
import { useParams } from "react-router-dom";
import { fetchDataFromApi,postData } from "@/utils/api";
import { toast } from 'react-toastify';
import { useCart } from "@/context";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [value, setValue] = useState([50, 3000]);
  const [sortBy, setSortBy] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const { id } = useParams();
  const [filterSubCat, setFilterSubcat] = useState("");
  const [subCatId, setSubCatId] = useState("");
  const [filterBrand, setFilterBrand] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const { handleAddToCart } = useCart();

    // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetchDataFromApi(`/product?subCatId=${id}&all=true`);
        setProducts(Array.isArray(res.productList) ? res.productList : []);
        setCurrentPage(1); 
        console.log(res)
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
      setLoading(false);
    };

    if (id) {
      fetchProducts();
      setSubCatId(id);
    }
  }, [id]);


  const handleChange = (event) => {
    const newSubCatId = event.target.value;
    setFilterSubcat(newSubCatId);
    setSubCatId(newSubCatId);
    filterData(newSubCatId);
    setFilterBrand("");
  };

  const filterByPrice = async () => {
    if (!subCatId) return;

    setLoading(true);
    try {
     const res = await fetchDataFromApi(
     `/product?minPrice=${value[0]}&maxPrice=${value[1]}&subCatId=${subCatId}&all=true`
   );
    setProducts(res.productList || []);
    } finally {
      setLoading(false);
    }
  };

const filterByBrand = async (brand) => {
  if (!brand || !subCatId) return;

  setLoading(true);
  try {
    const encodedBrand = encodeURIComponent(brand);
    const res = await fetchDataFromApi(
  `/product?brand=${encodedBrand}&subCatId=${subCatId}&all=true`
  );
    setProducts(res.productList || []);
  } finally {
    setLoading(false);
  }
};

  const handleChangeBrand = (e) => {
    const brand = e.target.value;
    setFilterBrand(brand);
    filterByBrand(brand);
  };

  useEffect(() => {
    if (subCatId) {
      filterByPrice();
    }
  }, [value, subCatId]);

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<Star key={i} className="star filled" size={16} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<Star key={i} className="star half-filled" size={16} />);
      } else {
        stars.push(<Star key={i} className="star" size={16} />);
      }
    }
    return stars;
  };

  const formatPrice = (price) => {
    return `₹${price.toFixed(2)}`;
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setValue([50, 3000]);
    setSortBy("featured");
    setFilterBrand("");
    setFilterSubcat("");
    if (id) {
      filterData(id);
    }
  };

useEffect(() => {
  window.scrollTo(0, 0);
  fetchSubCategories();
}, [id, subCatId]);   //  run again when route id or filter subcat changes


 const fetchSubCategories = async () => {
  try {
    const res = await fetchDataFromApi("/subcategory?all=true");
    if (res && Array.isArray(res.subCategoryList)) {
      setSubCategories(res.subCategoryList);

      // Pick active subcat from either filter or route
      const activeSubCatId = subCatId || id;

      const selectedSubCat = res.subCategoryList.find(
        (sub) => sub._id === activeSubCatId
      );

      if (selectedSubCat) {
        setCurrentCategoryId(selectedSubCat.category._id);
      }
    } else {
      console.error("Invalid subcategory response:", res);
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
  }
};


const relatedSubCategories = subCategories.filter(
  (sub) =>
    sub.category._id === currentCategoryId && sub._id !== id
);


  const uniqueBrands = [...new Set(products.map((p) => p.brand))];

 //  Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);


  return (
    <div className="product-listing-container">
      {/* Banner */}
      <div className="featured-banner">
        <div className="banner-content">
          <h1>Autumn Collection 2025</h1>
          <p>Discover timeless elegance with our new seasonal arrivals</p>
          <button className="shop-now-btn">Shop Collection</button>
        </div>
        <img
          src="https://diyarajvvir.in/cdn/shop/files/DR-Bloom-collection-banner-B.jpg?v=1746107183&width=1920"
          alt="Autumn Collection"
          className="banner-image"
        />
      </div>

      {/* Filters + Products */}
      <div className="product-listing-wrapper">
        {/* Sidebar Filters */}
        <aside className={`filter-sidebar ${showFilters ? "show" : ""}`}>
          <div className="filter-header">
            <h2>Filters</h2>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
            <button
              className="close-filters"
              onClick={() => setShowFilters(false)}
            >
              <X size={20} />
            </button>
          </div>

          {/* Categories */}

          <div className="filter-section">
            <h3>Related Subcategories</h3>
            <div className="filter-options">
              {relatedSubCategories.map((category) => (
                <label key={category._id} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filterSubCat === category._id}
                    onChange={handleChange}
                    value={category._id}
                  />
                  <span className="checkmark"></span>
                  {category.subCat}
                </label>
              ))}
              {relatedSubCategories.length === 0 && (
                <p>No related subcategories found.</p>
              )}
            </div>
          </div>

          {/* Price Range */}
          <div className="filterbox">
            <h6>FILTER BY PRICE</h6>
            <div className="price-inputs d-flex">
              <div className="price-input">
                <span>Rs</span>
                <input
                  type="number"
                  min={50}
                  max={3000}
                  value={value[0]}
                  onChange={(e) => setValue([+e.target.value, value[1]])}
                />
              </div>
              <span className="price-separator px-2">to</span>
              <div className="price-input">
                <span>Rs</span>
                <input
                  type="number"
                  min={50}
                  max={3000}
                  value={value[1]}
                  onChange={(e) => setValue([value[0], +e.target.value])}
                />
              </div>
            </div>

            <div className="price-slider mt-3">
              <input
                type="range"
                min={50}
                max={3000}
                step={5}
                value={value[0]}
                onInput={(e) => setValue([+e.target.value, value[1]])}
                className="range-min"
              />
              <input
                type="range"
                min={50}
                max={3000}
                step={5}
                value={value[1]}
                onInput={(e) => setValue([value[0], +e.target.value])}
                className="range-max"
              />
              <div className="slider-track"></div>
            </div>

            <div className="d-flex pt-2 pb-2 priceRange">
              <span>
                From: <strong className="text-dark">Rs: {value[0]}</strong>
              </span>
              <span className="ml-auto">
                To: <strong className="text-dark">Rs: {value[1]}</strong>
              </span>
            </div>
          </div>

          {/* Brands */}
          <div className="filter-section">
            <h3>Brands</h3>
            <div className="filter-options">
              {uniqueBrands.map((brand) => (
                <label key={brand} className="filter-option">
                  <input
                    type="checkbox"
                    checked={filterBrand === brand}
                    onChange={handleChangeBrand}
                    value={brand}
                  />
                  <span className="checkmark"></span>
                  {brand}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Main Area */}
        <main className="product-main">
          <div className="product-toolbar">
            <button
              className="filter-toggle"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Sliders size={18} /> Filters
            </button>

            <div className="view-options">
              <button
                className={`view-option ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-option ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
              >
                <List size={18} />
              </button>
            </div>

            <div className="results-count">
              <span>{products.length} products</span>
            </div>
          </div>

             {/* Product Cards */}
      {loading ? (
        <div className="loading-products">
          <div className="spinner"></div>
          <p>Loading collection...</p>
        </div>
      ) : currentProducts.length === 0 ? (
        <div className="no-products">
          <h3>No products found</h3>
        </div>
      ) : (
        <div className={`products-container ${viewMode}`}>
          {currentProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-image-container">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-actions">
                  <button
                    className={`wishlist-btn ${
                      wishlist.includes(product._id) ? "active" : ""
                    }`}
                    onClick={() => toggleWishlist(product._id)}
                  >
                    <Heart size={20} />
                  </button>
                </div>
               <button className="add-to-cart-btn2" onClick={(e) => { e.preventDefault();  handleAddToCart(product._id, 1); }}> 
                <ShoppingBag size={18} /> <span>Add to Cart</span>
                 </button>
              </div>

              <div className="product-info">
                <div className="product-brand">{product.brand}</div>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-price">
                  <span className="current-price">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


      {/*  Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`page-btn ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}


        </main>
      </div>
    </div>
  );
};

export default ProductListing;
