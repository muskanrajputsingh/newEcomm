import { useRef,useState,useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { fetchDataFromApi } from "../../utils/api"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "./Category.css"

const Category = () => {
  const swiperRef = useRef(null)
    const [catData, setCatData] = useState({ categoryList: []});
  
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCategories();
      }, []);
  
      const fetchCategories = async () => {
          const res = await fetchDataFromApi("/category?all=true");
          setCatData(res);
        };
      

  return (
    <section className="category-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Discover our wide range of products</p>
          <div className="navigation-buttons">
            <button className="nav-button prev" onClick={() => swiperRef.current?.slidePrev()}>
              <ChevronLeft size={20} />
            </button>
            <button className="nav-button next" onClick={() => swiperRef.current?.slideNext()}>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="category-swiper"
        >
          {catData.categoryList?.map((category) => (
            <SwiperSlide key={category._id}>
              <div className="category-card">
                <div className="card-inner">
                  <div
                    className="card-background"
                    style={{ background: `linear-gradient(135deg, ${category.catColor}20, ${category.catColor}40)` }}
                  ></div>
                  <div className="card-content">
                    <div className="category-image">
                      <img src={category.catImage || "/placeholder.svg"} alt={category.name} />
                    </div>
                    <div className="category-info">
                      <h3 className="category-name">{category.catName}</h3>
                      <p className="category-count">4,500+ items</p>
                      <button className="shop-button" style={{ background: category.catColor }}>
                        Shop Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Category

