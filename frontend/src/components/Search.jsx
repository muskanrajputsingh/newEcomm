import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchDataFromApi } from '../utils/api';

const Search = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const query = searchParams.get("query");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await fetchDataFromApi(`/product?search=${encodeURIComponent(query)}&all=true`);
        setProducts(res.productList || []);
      } catch (error) {
        console.error("Search fetch error:", error);
      }
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div className="search-results-page">
      <h2>Search results for "{query}"</h2>
      <div className="product-grid">
        {products.length > 0 ? (
          products.map(product => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.title} />
              <h4>{product.title}</h4>
              <p>₹{product.price}</p>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Search;
