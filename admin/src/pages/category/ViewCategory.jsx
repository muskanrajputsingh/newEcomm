import { useContext, useEffect, useState } from "react";
import "./Category.css";
import { fetchDataFromApi, deleteData, editData } from "../../utils/api";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { myContext } from "../../App";
import Pagination from '@mui/material/Pagination';

export default function ViewCategory() {
  const context = useContext(myContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [catData, setCatData] = useState({ categoryList: [], totalPages: 1 });
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState({
    _id: "",
    catName: "",
    catDescription: "",
    catColor: "",
    catImage: ""
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetchDataFromApi("/category");
    setCatData(res);
  };

  const deleteCategory = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteData(`/category/${id}`);
        context.setAlertBox({
          open: true,
          error: true,
          msg: 'Category Deleted Successfully!'
        });
        fetchCategories();
      } catch (error) {
        console.error("Error deleting category:", error);
        context.setAlertBox({
          open: true,
          error: true,
          msg: 'Failed to Delete!'
        });
      }
    }
  };

  const openEditModal = (item) => {
    setEditCat(item);
    setShowModal(true);
  };

  const handleEditInputChange = (e) => {
    setEditCat({ ...editCat, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editData(`/category/${editCat._id}`, editCat);
      setShowModal(false);
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'Category Updated Successfully!'
      });
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Failed to Update!'
      });
    }
  };

  const handlePagination = (event, value) => {
    fetchDataFromApi(`/category?page=${value}`).then((res) => {
      setCatData(res);
      console.log(res);
    });
  };

  return (
    <div className="view-category">
      <div className="page-header">
        <h1>View Categories</h1>
        <p>Manage your product categories</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Total Categories {catData.length}</h2>
          <div className="search-bar">
          <input
         type="text"
         placeholder="Search products..."
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
        />
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Category Name</th>
              <th>Description</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
            catData?.categoryList?.length !== 0 && catData?.categoryList.map((item, index) => (
              <tr key={index}>
                <td>
                  <img src={item.catImage} alt="" className="category-image" />
                </td>
                <td>
                  <strong>{item.catName}</strong>
                </td>
                <td>{item.catDescription}</td>
                <td>{item.catColor}</td>
                <td style={{ display: "flex", alignItems: "center",alignContent:"center",marginTop:'20px'}}>
                  <button
                    className="btn btn-success"
                    onClick={() => openEditModal(item)}
                    style={{ padding: "6px 12px", fontSize: "12px" }}
                  >
                    <FaEdit />
                  </button>
                  &nbsp;
                  <button
                    onClick={() => deleteCategory(item._id)}
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

        {
          catData?.totalPages > 1 &&
          <div className="flex justify-end p-4">
          <Pagination count={catData?.totalPages} color="danger" className='pagination' showFirstButton showLastButton onChange={handlePagination} />
        </div>
        }

      </div>

      {/* Modal */}
      {showModal && (
        <div className="modall-backdrop">
          <div className="modall">
            <h2>Edit Category</h2><br />
            <form onSubmit={handleEditSubmit} className="modall-form">
              <label>
                Category Name:
                <input
                  type="text"
                  name="catName"
                  value={editCat.catName}
                  onChange={handleEditInputChange}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="catDescription"
                  value={editCat.catDescription}
                  onChange={handleEditInputChange}
                />
              </label>
              <label>
                Color:
                <input
                  type="text"
                  name="catColor"
                  value={editCat.catColor}
                  onChange={handleEditInputChange}
                />
              </label>
              <label>
                Image URL:
                <input
                  type="text"
                  name="catImage"
                  value={editCat.catImage}
                  onChange={handleEditInputChange}
                />
              </label>

              <div className="image-preview">
              <label>Image Preview:</label>
              <img
              src={editCat.catImage || "https://static.thenounproject.com/png/5571359-200.png"}
              alt="Category preview"
              className="category-image-preview"
            />
            </div>

              <div className="modall-buttons">
                <button type="submit" className="btn btn-success">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
