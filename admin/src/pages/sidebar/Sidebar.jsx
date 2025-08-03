import "./Sidebar.css"
import { Link, useLocation } from "react-router-dom"

export default function Sidebar() {
  const location = useLocation()

  const menuItems = [
    { path: "/", id: "dashboard", label: "Dashboard", icon: "📊" },
    { path: "/add-category", id: "add-category", label: "Add Category", icon: "📁" },
    { path: "/view-category", id: "view-category", label: "View Categories", icon: "👁️" },
    { path: "/add-subcategory", id: "add-subcategory", label: "Add Sub Category", icon: "📂" },
    { path: "/view-subcategory", id: "view-subcategory", label: "View Sub Categories", icon: "👀" },
    { path: "/add-product", id: "add-product", label: "Add Product", icon: "🛍️" },
    { path: "/view-product", id: "view-product", label: "View Products", icon: "📦" },
  ]

  const isActive = (path) => {
    if (path === "/" && (location.pathname === "/" || location.pathname === "/dashboard")) {
      return true
    }
    return location.pathname === path
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo" style={{display:'flex',alignItems:'center',alignContent:'center',gap:'7px'}}>
            <img src="https://static.thenounproject.com/png/5571359-200.png" 
              height="40px" width="60px" alt="" />
              <Link to={'/productdetail'}><h2>PurpleHub </h2></Link>
            </div>

            <h3>🛒 Admin Panel</h3>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path} className={`nav-item ${isActive(item.path) ? "active" : ""}`}>
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">👤</div>
          <div>
            <p className="user-name">Admin User</p>
            <p className="user-role">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}
