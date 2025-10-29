import { useState, useEffect } from "react";
import "./Dashboard.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { fetchDataFromApi } from "../../utils/api";
import Pagination from "@mui/material/Pagination";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allProductData, setAllProductData] = useState({ productList: [] }); // for stats
  const [paginatedProductData, setPaginatedProductData] = useState({ productList: [], totalPages: 1, page: 1 }); // for table
  const [catData, setCatData] = useState({ categoryList: [] });
  const [subCatData, setSubCatData] = useState({ subCategoryList: [] });
  const [filterCategory, setFilterCategory] = useState("");

  const fetchingProduct = () => {
    window.scrollTo(0, 0);

    // Get all products for total stats
    fetchDataFromApi("/product?all=true")
      .then((res) => {
        console.log("All Products:", res);
        setAllProductData(res);
      })
      .catch((error) => console.error("Error fetching all products:", error));

    // Get paginated products (page 1 initially)
    fetchDataFromApi("/product?page=1&perPage=4")
      .then((res) => {
        console.log("Paginated Products:", res);
        setPaginatedProductData(res);
      })
      .catch((error) => console.error("Error fetching paginated products:", error));
  };

  const fetchingCategory = () => {
    fetchDataFromApi("/category?all=true").then((res) => {
      console.log("Categories:", res);
      setCatData(res);
    });
  };

  const fetchingSubCategory = () => {
    fetchDataFromApi("/subcategory?all=true")
      .then((res) => {
        console.log("Subcategories:", res);
        setSubCatData(res);
      })
      .catch((error) => console.error("Error fetching subcategories:", error));
  };

  const totalRevenue = allProductData.productList.reduce(
    (sum, product) => sum + product.price * product.countInStock,
    0
  );

  useEffect(() => {
    fetchingProduct();
    fetchingCategory();
    fetchingSubCategory();
  }, []);

  const filteredProducts = (paginatedProductData.productList || []).filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory ? product.category._id === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  const handlePagination = (event, value) => {
    fetchDataFromApi(`/product?page=${value}&perPage=4`)
      .then((res) => {
        setPaginatedProductData(res);
      })
      .catch((err) => console.error("Pagination error:", err));
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Hey Muskan! Welcome to your ecommerce admin panel</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{catData.categoryList.length}</h3>
          <p>Total Categories</p>
        </div>
        <div className="stat-card">
          <h3>{subCatData.subCategoryList.length}</h3>
          <p>Sub Categories</p>
        </div>
        <div className="stat-card">
          <h3>{allProductData.productList.length}</h3>
          <p>Total Products</p>
        </div>
        <div className="stat-card">
          <h3>₹{totalRevenue.toLocaleString()}</h3>
          <p>Total Inventory Value</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Recent Products</h2>
          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {catData.categoryList?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.catName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, index) => (
              <tr key={index}>
                <td>
                  <img src={item.images[0]} alt={item.name} className="product-image" />
                </td>
                <td>
                  <div>
                    <strong>{item.name}</strong>
                    <p style={{ fontSize: "12px", color: "#666", margin: "4px 0 0 0" }}>{item.description}</p>
                    <p>{item.brand}</p>
                  </div>
                </td>
                <td>{item.category?.catName || "-"}</td>
                <td>{item.subCat?.subCat || "-"}</td>
                <td>₹{item.price}</td>
                <td>{item.countInStock}</td>
                <td style={{ display: "flex", alignItems: "center" }}>
                  <button className="btn btn-success" style={{ padding: "6px 12px", fontSize: "12px" }}>
                    <FaEdit />
                  </button>
                  &nbsp;
                  <button
                    onClick={() => alert("Delete logic here")}
                    className="btn btn-danger"
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {paginatedProductData?.totalPages > 1 && (
          <div className="flex justify-end p-4">
            <Pagination
              count={paginatedProductData.totalPages}
              page={paginatedProductData.page}
              onChange={handlePagination}
              color="primary"
              showFirstButton
              showLastButton
              className="pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
}
