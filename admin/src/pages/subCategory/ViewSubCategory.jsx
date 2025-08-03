import { useState, useEffect ,useContext} from "react";
import "./SubCategory.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import {
  fetchDataFromApi,
  editData,
  deleteData,
} from "../../utils/api";
import { myContext } from "../../App";

export default function ViewSubCategory() {
  const context = useContext(myContext);
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [subCatData, setSubCatData] = useState({ subCategoryList: [], totalPages: 1 });
  const [categories, setCategories] = useState({ categoryList: [], totalPages: 1 });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDataState, setEditDataState] = useState({
    _id: "",
    subCat: "",
    description: "",
    category: "",
  });

  const fetchingSubCategory = () => {
    fetchDataFromApi("/subcategory")
      .then((res) => setSubCatData(res))
      .catch((error) => console.error("Error fetching subcategories:", error));
  };

  const fetchingCategories = () => {
    fetchDataFromApi("/category?all=true")
      .then((res) => setCategories(res))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    fetchingSubCategory();
    fetchingCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subcategory?")) {
      try {
        await deleteData(`/subcategory/${id}`);
        context.setAlertBox({
          open: true,
          error: false,
          msg: 'SubCategory Deleted successfully!'
        });
        fetchingSubCategory();
      } catch (err) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: 'Failed to Delete!'
        });
      }
    }
  };

  const handleEdit = (id) => {
    const selected = subCatData.find((item) => item._id === id);
    if (selected) {
      setEditDataState({
        _id: selected._id,
        subCat: selected.subCat,
        description: selected.description,
        category: selected.category._id,
      });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdate = async () => {
    try {
      await editData(`/subcategory/${editDataState._id}`, {
        subCat: editDataState.subCat,
        description: editDataState.description,
        category: editDataState.category,
      });
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'SubCategory Updated successfully!'
      });
      setIsEditModalOpen(false);
      fetchingSubCategory();
    } catch (err) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Failed to Update!'
      });
    }
  };

  const handlePagination = (event, value) => {
    fetchDataFromApi(`/subcategory?page=${value}`).then((res) => {
      setSubCatData(res);
      console.log(res);
    });
  };

  return (
    <div className="view-subcategory">
      <div className="page-header">
        <h1>View Sub Categories</h1>
        <p>Manage your product sub categories</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Total Sub Categories : {subCatData.length}</h2>

        <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.categoryList.map((cat) => (
          <option key={cat._id} value={cat._id}>{cat.catName}</option>
        ))}
      </select>
      </div>

        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Sub Category Name</th>
              <th>Parent Category</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {subCatData.subCategoryList
          .filter((item) =>
            item.subCat.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (filterCategory === "" || item.category._id === filterCategory)
          )
          .map((item, index) => (
            <tr key={index}>
              <td><strong>{item.subCat}</strong></td>
              <td>{item.category.catName}</td>
              <td>{item.description}</td>
              <td style={{ display: "flex", alignItems: "center" }}>
                <button
                  className="btn btn-success"
                  onClick={() => handleEdit(item._id)}
                  style={{ padding: "6px 12px", fontSize: "12px" }}
                >
                  <FaEdit />
                </button>
                &nbsp;
                <button
                  onClick={() => handleDelete(item._id)}
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
                  subCatData?.totalPages > 1 &&
                  <div className="flex justify-end p-4">
                  <Pagination count={subCatData?.totalPages} color="danger" className='pagination' showFirstButton showLastButton onChange={handlePagination} />
                </div>
        }
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Sub Category</h3>
            <input
              type="text"
              value={editDataState.subCat}
              onChange={(e) =>
                setEditDataState({ ...editDataState, subCat: e.target.value })
              }
              placeholder="Sub Category Name"
            />
            <input
              type="text"
              value={editDataState.description}
              onChange={(e) =>
                setEditDataState({
                  ...editDataState,
                  description: e.target.value,
                })
              }
              placeholder="Description"
            />
            <select
              value={editDataState.category}
              onChange={(e) =>
                setEditDataState({ ...editDataState, category: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.catName}
                </option>
              ))}
            </select>

            <div className="modal-actions">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
