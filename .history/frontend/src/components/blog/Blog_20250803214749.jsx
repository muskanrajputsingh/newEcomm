import { Calendar, User, ArrowRight } from "lucide-react"
import "./log.css"

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Summer Fashion Trends 2024",
      excerpt: "Discover the hottest fashion trends that will dominate this summer season.",
      // image: "https://images.pexels.com/photos/947422/pexels-photo-947422.jpeg?auto=compress&cs=tinysrgb&w=1200&lazy=load",
      image:"https://img.buzzfeed.com/buzzfeed-static/static/2023-06/5/21/enhanced/408f3b8cdb4f/original-1028-1686002328-17.jpg?crop=1581:830;0,0%26downsize=1250:*",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      category: "Fashion",
      readTime: "5 min read",
    },
    {
      id: 2,
      title: "Sustainable Fashion: A Complete Guide",
      excerpt: "Learn how to build a sustainable wardrobe that looks good and feels good.",
      image: "https://www.anitadongre.com/on/demandware.static/-/Sites-AD-INDIA-Library/default/dwe4b9345d/images/Home%20page/April%202025/25_April_2025/Mid_PLP_NEW_ARRIVALS.jpg",
      author: "Emma Davis",
      date: "March 12, 2024",
      category: "Lifestyle",
      readTime: "7 min read",
    },
    {
      id: 3,
      title: "Tech Accessories That Changed Everything",
      excerpt: "From smartwatches to wireless earbuds, explore the tech that revolutionized our daily lives.",
      image: "https://www.anitadongre.com/on/demandware.static/-/Sites-AD-INDIA-Library/default/dw28a57e3b/images/Home%20page/April%202025/AD_Coords_WEB_latest.jpg",
      author: "Michael Chen",
      date: "March 10, 2024",
      category: "Technology",
      readTime: "4 min read",
    },
    {
      id: 3,
      title: "Tech Accessories That Changed Everything",
      excerpt: "From smartwatches to wireless earbuds, explore the tech that revolutionized our daily lives.",
      image: "https://im.indiatimes.in/content/2024/Jul/statement-accessories-1_668bf5395c137.jpg?w=1200&h=900&cc=1&webp=1&q=75",
      author: "Michael Chen",
      date: "March 10, 2024",
      category: "Technology",
    },
  ]
  
  return (
    <section className="blog-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Latest from Our Blog</h2>
          <p className="section-subtitle">Stay updated with fashion trends and lifestyle tips</p>
        </div>

        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <article key={post.id} className={`blog-card ${index === 0 ? "featured" : ""}`}>
              <div className="blog-image">
                <img src={post.image || "/placeholder.svg"} alt={post.title} />
                <div className="image-overlay">
                  <div className="category-badge">{post.category}</div>
                </div>
              </div>

              <div className="blog-content">
                <div className="blog-meta">
                  <div className="meta-item">
                    <User size={14} />
                    <span>{post.author}</span>
                  </div>
                  <div className="meta-item">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <div className="read-time">{post.readTime}</div>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>

                <button className="read-more">
                  Read More
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="blog-cta">
          <button className="view-all-btn">View All Articles</button>
        </div>
      </div>
    </section>
  )
}

export default Blog
