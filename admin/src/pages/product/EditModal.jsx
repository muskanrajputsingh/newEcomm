// EditModal.jsx
import { ImCross } from "react-icons/im"
import { Rating } from "@mui/material"

export default function EditModal({
  show,
  onClose,
  formData,
  onChange,
  onSubmit,
  images,
  addImage,
  removeImage,
  rating,
  setRating,
  setFormRating,
  categories,
  subCategories
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Product</h2>
          <button onClick={onClose}><ImCross /></button>
        </div>

        <form onSubmit={onSubmit}>
        <input type="text" name="name" value={formData.name} onChange={onChange} placeholder="Name" required />
        <textarea name="description" value={formData.description} onChange={onChange} required />
        <input type="text" name="brand" value={formData.brand} onChange={onChange} required />
        <input type="number" name="price" value={formData.price} onChange={onChange} required />
        <input type="number" name="oldPrice" value={formData.oldPrice} onChange={onChange} />

        {/* NEW: Size, Discount, and Color */}
        <input type="text" name="size" value={formData.size} onChange={onChange} placeholder="Size" />
        <input type="text" name="discount" value={formData.discount} onChange={onChange} placeholder="Discount" />
        <input type="text" name="color" value={formData.color} onChange={onChange} placeholder="Color" />

        <select name="category" value={formData.category} onChange={onChange} required>
            <option value="">Select Category</option>
            {categories.categoryList.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.catName}</option>
            ))}
        </select>

        <select name="subCat" value={formData.subCat} onChange={onChange} required>
            <option value="">Select Sub Category</option>
            {subCategories.subCategoryList.map((sub) => (
            <option key={sub._id} value={sub._id}>{sub.subCat}</option>
            ))}
        </select>

        <input type="number" name="countInStock" value={formData.countInStock} onChange={onChange} required />

        {/* NEW: Checkboxes for isFeatured and isTrendy */}
        <div className="check-product">
        <label>
            <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={onChange} />
            Is Featured
        </label>
        <label>
            <input type="checkbox" name="isTrendy" checked={formData.isTrendy} onChange={onChange} />
            Is Trendy
        </label>
        </div>

        <Rating
            name="rating"
            value={Number(rating)}
            onChange={(e, newValue) => {
            setRating(newValue)
            setFormRating(newValue)
            }}
        />

        <input type="text" placeholder="Image URL" onKeyDown={(e) => {
            if (e.key === 'Enter') {
            addImage(e.target.value)
            e.target.value = ''
            e.preventDefault()
            }
        }} />

  <div className="image-preview-grid pimg">
    {images.map((url, idx) => (
      <div key={idx}>
        <img src={url} alt={`img-${idx}`} />
        <button type="button" onClick={() => removeImage(idx)}><ImCross /></button>
      </div>
    ))}
  </div>

  <button className="btn-save" type="submit">Save</button>
</form>

      </div>
    </div>
  )
}
