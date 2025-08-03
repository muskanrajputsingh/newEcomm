import { useState,useContext,useEffect} from "react"
import "./SubCategory.css"
import { fetchDataFromApi, } from "../../utils/api";
import { myContext } from "../../App";
import { postData } from "../../utils/api";

export default function AddSubCategory() {
  const context = useContext(myContext);
  const [catData, setCatData] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    subCat: "",
    description:"",
  })
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDataFromApi("/category").then((res) => {
      console.log(res);
      setCatData(res);
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.category === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please select a category.'
      });
      return;
    }
  
    if (formData.subCat === "") {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please enter sub category.'
      });
      return;
    }
  
    try {
      await postData('/subcategory', formData);
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'SubCategory submitted successfully!'
      });
  
      setFormData({ category: '', subCat: '', description: '' });
  
      setTimeout(() => {
      window.location.href="view-subcategory"
      }, 1000);
    } catch (error) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Something went wrong. Please try again.'
      });
    }
  };
  

  return (
    <div className="add-subcategory">
      <div className="page-header">
        <h1>Add New Sub Category</h1>
        <p>Create a new sub category under existing categories</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="categoryId">Parent Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {catData.length > 0 &&
              catData.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.catName}
                </option>
              ))}
          </select>
        </div>


          <div className="form-group">
            <label htmlFor="name">Sub Category Name *</label>
            <input
              type="text"
              id="name"
              name="subCat"
              value={formData.subCat}
              onChange={handleChange}
              placeholder="Enter sub category name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter sub category description"
              rows="4"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Sub Category
          </button>
        </form>
      </div>
    </div>
  )
}
