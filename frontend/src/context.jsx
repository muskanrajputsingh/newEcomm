import { createContext, useContext, useState } from "react";
import { postData } from "./utils/api";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Add to cart function
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const data = await postData("/cart", { productId, quantity });
      toast.success("🛒 Product added to cart!");

      console.log("Cart Response:", data);

      // optional: update local cart state
      setCartItems((prev) => [...prev, data]);

    } catch (error) {
      console.error("Error adding to cart:", error.response?.data || error.message);
      toast.error("❌ Failed to add to cart");
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, handleAddToCart,setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the Cart Context
export const useCart = () => useContext(CartContext);
