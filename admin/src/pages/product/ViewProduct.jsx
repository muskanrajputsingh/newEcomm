// ViewProduct.jsx
import { useState, useEffect, useContext } from "react"
import "./Product.css"
import { FaEdit } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import { fetchDataFromApi, deleteData, editData } from "../../utils/api"
import { myContext } from "../../App"
import EditModal from "./EditModal"
import Pagination from '@mui/material/Pagination';

export default function ViewProduct() {
  const context = useContext(myContext)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("")
  const [productData, setProductData] = useState({ productList: [], totalPages: 1 })
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [catData, setCatData] = useState({ categoryList: [], totalPages: 1 })
  const [subCatData, setSubCatData] = useState({ subCategoryList: [], totalPages: 1 })
  const [ratingsValue, setRatingValue] = useState('')
  const [productImagesArr, setProductImagesArr] = useState([])
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    brand: '',
    price: 0,
    oldPrice: 0,
    category: '',
    subCat: '',
    countInStock: 0,
    rating: 0,
    isFeatured: false,
    isTrendy: false,
    size: '',
    color: '',
    discount: '',
    images: []
  })

  useEffect(() => {
    fetchingProduct()
    fetchingCategory()
    fetchingSubCategory()
  }, [])

  const fetchingProduct = () => {
    window.scrollTo(0, 0)
    fetchDataFromApi('/product')
      .then((res) => {
        console.log("Fetched products:", res) // Console log added
        setProductData(res)
      })
      .catch((error) => console.error("Error fetching Products:", error))
  }
  

  const fetchingCategory = () => {
    fetchDataFromApi('/category?all=true').then(setCatData)
  }

  const fetchingSubCategory = () => {
    fetchDataFromApi('/subcategory?all=true').then(setSubCatData)
  }

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteData(`/product/${id}`).then(() => {
        context.setAlertBox({ open: true, msg: "Product deleted successfully!", error: false })
        fetchingProduct()
      }).catch(() => {
        context.setAlertBox({ open: true, msg: "Error deleting product", error: true })
      })
    }
  }

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setEditFormData({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      oldPrice: product.oldPrice,
      category: product.category?._id,
      subCat: product.subCat?._id,
      countInStock: product.countInStock,
      rating: product.rating,
      isFeatured: product.isFeatured,
      isTrendy: product.isTrendy,
      size: product.size,
      color: product.color,
      discount: product.discount,
    })
    setProductImagesArr(product.images)
    setRatingValue(product.rating)
    setShowEditModal(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    const updatedData = { ...editFormData, images: productImagesArr }

    editData(`/product/${selectedProduct._id}`, updatedData).then(() => {
      context.setAlertBox({ open: true, msg: "Product updated successfully!", error: false })
      setShowEditModal(false)
      fetchingProduct()
    }).catch(() => {
      context.setAlertBox({ open: true, msg: "Error updating product", error: true })
    })
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const addProductImage = (url) => {
    if (url.trim()) {
      setProductImagesArr(prev => [...prev, url.trim()])
    }
  }

  const removeImage = (index) => {
    setProductImagesArr(prev => prev.filter((_, i) => i !== index))
  }

  const filteredProducts = (productData.productList || []).filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory ? product.category._id === filterCategory : true
    return matchesSearch && matchesCategory
  })

  const handlePagination = (event, value) => {
    fetchDataFromApi(`/product?page=${value}`).then((res) => {
      setProductData(res);
      console.log(res);
    });
  };

  return (
    <div className="view-product">
      <div className="page-header">
        <h1>View Products</h1>
        <p>Manage your product inventory</p>
      </div>

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
            <option key={cat._id} value={cat._id}>{cat.catName}</option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th style={{width:'30%'}}>Name</th>
              <th>Stock</th>
              <th>Old Price</th>
              <th>Price</th>
              <th>Featured?</th>
              <th>Trendy?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>
                <td><img src={product.images?.[0]} alt={product.name} width="60" /></td>
                <td><b>{product.name}</b>
                  <p>{product.description}</p>
                  <p><b>{product.brand}</b></p>
                </td>
                <td>{product.countInStock}</td>
                <td>₹{product.oldPrice}</td>
                <td>₹{product.price}</td>
                <td style={{ color: product.isFeatured ? "green" : "red", fontWeight: "bold" }}>
                {product.isFeatured ? "Featured" : "No"}
              </td>
              <td style={{ color: product.isTrendy ? "green" : "red", fontWeight: "bold" }}>
                {product.isTrendy ? "Trendy" : "No"}
              </td>
                <td className="productEdit-btn">
                  <button style={{backgroundColor:'#4cca61',border:'none',color:'white'}} onClick={() => handleEdit(product)}><FaEdit /></button>&nbsp;
                  <button style={{backgroundColor:'red',border:'none',color:'white'}} onClick={() => deleteProduct(product._id)}><MdDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
         {
                  productData?.totalPages > 1 &&
                  <div className="flex justify-end p-4">
                  <Pagination count={productData?.totalPages} color="danger" className='pagination' showFirstButton showLastButton onChange={handlePagination} />
                </div>
          }
      </div>

      {showEditModal && (
        <EditModal
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          formData={editFormData}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
          images={productImagesArr}
          addImage={addProductImage}
          removeImage={removeImage}
          rating={ratingsValue}
          setRating={setRatingValue}
          setFormRating={(val) => setEditFormData(prev => ({ ...prev, rating: val }))}
          categories={catData}
          subCategories={subCatData}
        />
      )}
    </div>
  )
}
