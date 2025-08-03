import { MapPin, Truck, Clock, Shield } from "lucide-react"
import "./Map.css"

const Map = () => {
  const deliveryStats = [
    {
      icon: <MapPin size={24} />,
      title: "500+ Cities",
      description: "Nationwide Coverage",
    },
    {
      icon: <Truck size={24} />,
      title: "24-48 Hours",
      description: "Express Delivery",
    },
    {
      icon: <Clock size={24} />,
      title: "Same Day",
      description: "In Metro Cities",
    },
    {
      icon: <Shield size={24} />,
      title: "100% Safe",
      description: "Secure Packaging",
    },
  ]

  return (
    <section className="delivery-section">
      <div className="container">
        <div className="delivery-content">
          <div className="delivery-info">
            <h2 className="delivery-title">We Deliver All Over India</h2>
            <p className="delivery-subtitle">
              From Kashmir to Kanyakumari, we ensure your orders reach you safely and on time.
            </p>

            <div className="delivery-stats">
              {deliveryStats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-icon">{stat.icon}</div>
                  <div className="stat-content">
                    <h4>{stat.title}</h4>
                    <p>{stat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="delivery-map">
            <div className="map-container">
              <img src="https://lh3.googleusercontent.com/NixqVGqs49CgXyCsv2vwetSm45KFEr0BhTkMqNEU44YMveJQ5SoVORwYivvKsgGigRV2pRUEipyuwzDXUGsjMXJwkgqW7mVEvyBCHy8=w450-h350?height=400&width=600" alt="India Delivery Map" className="map-image" />
              <div className="delivery-points">
                <div className="point point-1">
                  <div className="pulse"></div>
                </div>
                <div className="point point-2">
                  <div className="pulse"></div>
                </div>
                <div className="point point-3">
                  <div className="pulse"></div>
                </div>
                <div className="point point-4">
                  <div className="pulse"></div>
                </div>
                <div className="point point-5">
                  <div className="pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Map
