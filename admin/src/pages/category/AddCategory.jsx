import { useState } from "react"
import "./Category.css";
import { postData } from "../../utils/api";
import { useContext } from "react";
import { myContext } from "../../App";

export default function AddCategory() {
  const context=useContext(myContext)
  const [formData, setFormData] = useState({
    catName: "",
    catImage: "",
    catDescription: "",
    catColor:""
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.catName || !formData.catImage.length) {
      console.log("🚨 Missing fields detected!");
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Please fill all the details'
      });
      return; 
    }

    try {
      console.log("🔄 Sending data:", formData);
      const response = await postData('/category', formData);
      console.log("✅ Server response:", response);
      context.setAlertBox({
        open: true,
        error: false,
        msg: 'Category submitted successfully!'
      });
      setFormData({ catName: '', catImage:'',catDescription:'',catColor:'' });

      setTimeout(() => {
        window.location.href = "/view-category";
      }, 1000);

    } catch (error) {
      console.log("❌ Error submitting category:", error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: 'Error submitting category'
      });
    }
};

  return (
    <div className="add-category">
      <div className="page-header">
        <h1>Add New Category</h1>
        <p>Create a new product category for your store</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Category Name *</label>
            <input
              type="text"
              id="name"
              name="catName"
              value={formData.catName}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Category Image URL</label>
            <input
              type="url"
              id="image"
              name="catImage"
              value={formData.catImage}
              onChange={handleChange}
              placeholder="Enter category image URL"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="catDescription"
              value={formData.catDescription}
              onChange={handleChange}
              placeholder="Enter category description"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="color">Category Color *</label>
            <input
              type="text"
              id="color"
              name="catColor"
              value={formData.catColor}
              onChange={handleChange}
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="image-preview">
            <img
              src={formData.catImage || "https://static.thenounproject.com/png/5571359-200.png"}
              alt="Category preview"
              className="category-image-preview"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Add Category
          </button>
        </form>
      </div>
    </div>
  )
}
