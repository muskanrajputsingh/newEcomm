import { useState,useRef,useEffect, useContext} from "react"
import "./Product.css"
import { ImCross } from "react-icons/im";
import { Rating } from '@mui/material';
import { fetchDataFromApi,postData } from "../../utils/api";
import { myContext } from "../../App";

export default function AddProduct() {
  const context = useContext(myContext)
  const productImages = useRef();
  const [catData,setCatData] = useState({ categoryList: [], totalPages: 1 });
  const [subCatData,setSubCatData] = useState({ subCategoryList: [], totalPages: 1 });
  const [ratingsValue,setRatingValue] = useState('');
  const [productImagesArr , setProductImagesArr ] = useState([]);

  const [formData, setFormData] = useState({
    name:'',
    description:'',
    brand:'',
    price:null,
    oldPrice:null,
    catName:'',
    subCatName:'',
    category:'',
    subCat:'',
    countInStock:null,
    rating:null,
    isFeatured:null,
    isTrendy:null,
    size:'',
    color:'',
    discount:'',
  })

  const addProductImages=(e)=>{
    e.preventDefault();
    const imageUrl = productImages.current.value.trim();
  if (imageUrl) {
    setProductImagesArr(prevArray => [...prevArray, imageUrl]);
    productImages.current.value = "";
  }
  }
  const removeImg = (index) => {
    setProductImagesArr((prevArray) => prevArray.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     formData.images = productImagesArr
     console.log(formData);

     if(formData.name===""){
      context.setAlertBox({
        open:true,
        msg:'Please add product name',
        error:true
      })
      return false;
     }
     if(formData.description===""){
      context.setAlertBox({
        open:true,
        msg:'Please add product description',
        error:true
      })
      return false;
     }
     if(formData.brand===""){
      context.setAlertBox({
        open:true,
        msg:'Please add product brand',
        error:true
      })
      return false;
     }
     if(formData.price===null){
      context.setAlertBox({
        open:true,
        msg:'Please add product price',
        error:true
      })
      return false;
     }
     if(formData.oldPrice===null){
      context.setAlertBox({
        open:true,
        msg:'Please add product oldPrice',
        error:true
      })
      return false;
     }
     if(formData.category===""){
      context.setAlertBox({
        open:true,
        msg:'Please select product category',
        error:true
      })
      return false;
     }
     if(formData.subCat===""){
      context.setAlertBox({
        open:true,
        msg:'Please select product sub category',
        error:true
      })
      return false;
     }
     if(formData.countInStock===null){
      context.setAlertBox({
        open:true,
        msg:'Please add product count In Stock',
        error:true
      })
      return false;
     }
     if(formData.rating===0){
      context.setAlertBox({
        open:true,
        msg:'Please select product rating',
        error:true
      })
      return false;
     }
     if(formData.isFeatured===null){
      context.setAlertBox({
        open:true,
        msg:'Please select product is featured or not',
        error:true
      })
      return false;
     }
     if(formData.isTrendy===null){
      context.setAlertBox({
        open:true,
        msg:'Please select product is featured or not',
        error:true
      })
      return false;
     }

     postData('/product',formData).then((res)=>{
      context.setAlertBox({
      open:true,
      msg:"Product added successfully!",
      error:false
      })
      setFormData({
        name:'',
        description:'',
        brand:'',
        price:0,
        oldPrice:0,
        catName:'',
        subCatName:'',
        category:'',
        subCat:'',
        countInStock:0,
        rating:0,
        isFeatured:false,
        isTrendy:false,
        size:'',
        color:'',
        discount:'',
        images:[]
      });

      setTimeout(() => {
        window.location.href = "/view-product";
      }, 1000); 
     });

  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  useEffect(()=>{
    window.scrollTo(0,0);
    fetchingCategory();
    fetchingSubCategory();
  },[]);

  const fetchingCategory = () => {
    fetchDataFromApi('/category?all=true').then((res)=>{
      console.log(res)
      setCatData(res);
    })
  }

  const fetchingSubCategory = () => {
  window.scrollTo(0,0);
  fetchDataFromApi('/subcategory?all=true').then((res) => {
      console.log("API response for subcategories:", res);
      setSubCatData(res);
    })
    .catch((error) => console.error("Error fetching categories:", error));
};


  return (
    <div className="add-product">
      <div className="page-header">
        <h1>Add New Product</h1>
        <p>Add a new product to your inventory</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>

        <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                required
              />
            </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="categoryId">Category *</label>
              <select id="categoryId" name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select a category</option>
              {catData.categoryList.length > 0 &&
              catData.categoryList?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.catName}
                </option>
              ))}
          </select>
            </div>

            <div className="form-group">
              <label htmlFor="subCategoryId">Sub Category *</label>
              <select
                id="subCategoryId"
                name="subCat"
                value={formData.subCat}
                onChange={handleChange}
                required
              >
                <option value="">Select a sub category</option>
                {subCatData.subCategoryList.length > 0 &&
                subCatData.subCategoryList?.map((item, index) => (
                <option key={index} value={item._id}>
                  {item.subCat}
                </option>
              ))}
              </select>
            </div>

          <div className="form-group">
         <label htmlFor="rating">Rating *</label>
         <Rating  defaultValue={3.5} precision={0.5} 
         name="simple-controlled"
         value={ratingsValue}
         onChange={(event,newValue)=>{
          setRatingValue(newValue);
          setFormData(()=>({
            ...formData,
            rating:newValue
          }))
         }}/>
         </div>

          </div> 
{/* // 2nd row */}
          <div className="form-row">
           
            <div className="form-group">
              <label htmlFor="price">Price (₹) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="oldprice">Old Price (₹) *</label>
              <input
                type="number"
                id="oldprice"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="discount">Discount (%) *</label>
              <input
                type="number"
                id="discount"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

          </div>
  {/* //3 row  */}
          <div className="form-row">

            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="size">Size *</label>
              <input
                type="text"
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                placeholder="Enter product size"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="color">Product Color *</label>
              <input
                type="text"
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="Enter product color"
                required
              />
            </div>

           </div>

           {/* 4th */}

           <div className="form-row">
           <div className="form-group">
              <label htmlFor="brand">Product Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="Enter product brand"
                required
              />
            </div>

            <div className="form-group">
            <label htmlFor="featured">Is Featured *</label>
            <select
              id="featured"
              name="isFeatured"
              value={formData.isFeatured}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="none">None</option>
            </select>
          </div>

          <div className="form-group">
          <label htmlFor="trendy">Is Trendy *</label>
          <select
            id="trendy"
            name="isTrendy"
            value={formData.isTrendy}
            onChange={handleChange}
            required
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="none">None</option>
          </select>
        </div>
         </div>


         <div className="form-group">
            <label htmlFor="description">Product Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="4"
            />
          </div>

          <div className="form-group">
          <h3 className='text-[14px] mb-1 font-[600]'>Product Image</h3>
          <div className="flex items-center gap-3 inputBtn">
          <input type="text" ref={productImages}  className='w-full h-[40px] border border-[rgba(0,0,0,0.3)] focus:outline-none 
          focus:border-[rgba(0,0,0,0.4)] rounded-sm p-3 text-sm'  name='images' onChange={handleChange}/>
          <button className='btn' onClick={addProductImages}>Add</button>
          </div>
          </div>

          <div className="media-container">
          <h3 className="media-title">Media & Image</h3>
          <div className="img-grid" id="imgGrid">
          {
            productImagesArr?.map((image,index)=>{
              return(
                <div className="img-media" key={index}>
                <img src={image} alt="image"/>
                <ImCross  className='removee' onClick={() => removeImg(index)}/>
                </div>
              )
            })
          } 
          </div>
        </div>


          <button type="submit" className="btn btn-primary" >
            Add Product
          </button>
        </form>
      </div>
    </div>
  )
}
