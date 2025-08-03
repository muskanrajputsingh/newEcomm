import { useState,useEffect } from "react"
import { Search, ShoppingCart, User, Menu, X, Heart } from "lucide-react"
import "./Navbar.css"
import { Link } from "react-router-dom";
import { fetchDataFromApi } from "../../utils/api";
import { RiLoginCircleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [catData, setCatData] = useState({ categoryList: []});
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [subCatData, setSubCatData] = useState({ subCategoryList: []})
  const [cartItems,setCartItems] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategories();
    fetchingSubCategory();

    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown') && !event.target.closest('.nav-btn')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

    useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await fetchDataFromApi("/cart");
        setCartItems(data.cart || []);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, []);


  const fetchCategories = async () => {
    const res = await fetchDataFromApi("/category?all=true");
    setCatData(res);
    console.log("Categories:", res)
  };
   
  const fetchingSubCategory = async () => {
    try {
      const res = await fetchDataFromApi('/subcategory?all=true');
      setSubCatData(res);
      console.log("Subcategories:", res);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  }

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const handleSearch = () => {
  if (!searchQuery.trim()) return;

  const query = searchQuery.trim().toLowerCase();

  // Try to match search input with subcategory name
  const matchedSubCat = subCatData.subCategoryList.find(sub =>
    sub.subCat.toLowerCase().includes(query)
  );

  if (matchedSubCat) {
    navigate(`/subCat/${matchedSubCat._id}`);
  } else {
    alert("No matching subcategory found.");
  }
};

  return (
    <nav className="navbar">
      {/* Top Navbar */}
      <div className="navbar-top">
        <div className="container">
          <div className="navbar-top-content">
            <div className="logo" style={{display:'flex',alignItems:'center',alignContent:'center',gap:'7px'}}>
              <img src="https://static.thenounproject.com/png/5571359-200.png" 
                height="40px" width="60px" alt="" />
              <Link to={'/'}><h2>PurpleHub </h2></Link>
            </div>

            <div className="navbar-actions">
              <button className="nav-btn">
                <Link to="/"><Heart size={20} /></Link>
                <span className="badge">2</span>
              </button>
              <button className="nav-btn">
                <Link to='/cart'><ShoppingCart size={20} /></Link>
                <span className="badge">{cartItems.length}</span>
              </button>
              <div className="user-dropdown-container">
                <button className="nav-btn" onClick={toggleUserDropdown}>
                  <User size={20} />
                </button>
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">Orders</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/settings">Settings</Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/">Logout</Link>
                  </div>
                )}
              </div>
              <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className={`navbar-bottom ${isMenuOpen ? "mobile-open" : ""}`}>
        <div className="container">
          <div className="navbar-bottom-content">

            <div className="categories">
              {catData.categoryList?.map((category, index) => (
                <div className="category-item" key={index}>
                  <Link to="#" className="category-link">
                    {category.catName}
                  </Link>
                  <div className="category-dropdown">
                    <div className="category-dropdown-header">
                      <Link to={''}>
                       {
                        subCatData.subCategoryList?.filter(sub=>sub.category && sub.category._id === category._id).map((sub,index)=>(
                          <>
                         <li><Link to={`/subCat/${sub?._id}`} key={index}>{sub.subCat}</Link></li> 
                          <div className="dropdown-divider"></div>
                          </>
                        ))
                       }
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="search-bar">
              <div className="search-container">
                <Search size={20} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />

             <button className="search-btn" onClick={handleSearch}>
                  Search
             </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
