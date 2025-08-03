"use client"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import "./Carousel.css"

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const slides = [
    {
      id: 1,
      title: "Summer Collection",
      subtitle: "Up to 20% OFF",
      description: "Discover the latest trends in fashion",
      buttonText: "Shop Now",
      backgroundImage: "url('https://cdn.pixabay.com/photo/2017/08/01/14/18/people-2565789_1280.jpg')",
    },
    {
        id:2,
        title: "Classy FootWears",
        subtitle: "60% OFF",
        description: "Transform your living space",
        buttonText: "Discover",
        backgroundImage:"url('https://cdn.pixabay.com/photo/2018/08/27/15/12/handbag-3635212_1280.jpg')"
    },
    {
      id: 3,
      title: "Electronics Sale",
      subtitle: "70% OFF",
      description: "Latest gadgets at unbeatable prices",
      buttonText: "Explore",
      backgroundImage: "url('https://i.pinimg.com/736x/c7/83/8d/c7838dacbe7ac5900dffa7176cd8c084.jpg')",
    },
    {
      id: 4,
      title: "Nayka Sale",
      subtitle: "40% OFF",
      description: "Lipstics and Blushes all Glossy",
      buttonText: "Discover",
      backgroundImage: "url('https://tintcosmetics.in/cdn/shop/articles/Pink_-_Banner.jpg?v=1698838241')",
    },
    {
      id:5,
      title: "Fashion Week ",
      subtitle: "40% OFF",
      description: "Transform your living Stylish",
      buttonText: "Discover",
      backgroundImage:"url('https://i.pinimg.com/736x/1f/7e/78/1f7e781ab40ad41debe26d18e88cde74.jpg')"
    }
  ]

  const changeSlide = useCallback((direction) => {
    if (isTransitioning) return

    setIsTransitioning(true)
    setCurrentSlide((prev) => {
      if (direction === "next") {
        return (prev + 1) % slides.length
      }
      return (prev - 1 + slides.length) % slides.length
    })

    // Reset transition lock after animation completes
    setTimeout(() => {
      setIsTransitioning(false)
    }, 600)
  }, [isTransitioning, slides.length])

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTransitioning) {
        changeSlide("next")
      }
    }, 5000)

    return () => clearInterval(timer)
  }, [changeSlide, isTransitioning])

  const nextSlide = () => changeSlide("next")
  const prevSlide = () => changeSlide("prev")

  return (
    <div className="carousel">
      <div className="carousel-container">
        {slides.map((slide, index) => {
          let slideClass = "carousel-slide"
          if (index === currentSlide) slideClass += " active"
          else if (index === (currentSlide - 1 + slides.length) % slides.length) slideClass += " prev"
          else if (index === (currentSlide + 1) % slides.length) slideClass += " next"

          return (
            <div 
              key={slide.id} 
              className={slideClass} 
              style={{ 
                backgroundImage: slide.backgroundImage,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="slide-content">
                <div className="slide-text">
                  <h1 className="slide-title">{slide.title}</h1>
                  <h2 className="slide-subtitle">{slide.subtitle}</h2>
                  <p className="slide-description">{slide.description}</p>
                  <button className="slide-button">{slide.buttonText}</button>
                </div>
               
              </div>
            </div>
          )
        })}
      </div>

      <button className="carousel-btn prev" onClick={prevSlide} disabled={isTransitioning}>
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-btn next" onClick={nextSlide} disabled={isTransitioning}>
        <ChevronRight size={24} />
      </button>

      {/* <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => !isTransitioning && setCurrentSlide(index)}
            disabled={isTransitioning}
          />
        ))}
      </div> */}
    </div>
  )
}

export default Carousel
