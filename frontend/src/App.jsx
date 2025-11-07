import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Suspense, lazy } from "react";

import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Checkout from "./pages/checkout/Checkout";


import { CartContextProvider } from "./context";

//  Lazy-loaded pages
const Home = lazy(() => import("./pages/home/Home"));
const ProductDetail = lazy(() => import("./pages/productDetail/ProductDetail"));
const Cart = lazy(() => import("./pages/cart/Cart"));
const ProductListing = lazy(() => import("./pages/productListing/ProductListing"));

function App() {
  return (
    <CartContextProvider>
      <BrowserRouter>
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />

        {/* Suspense provides fallback UI while components load */}
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/productdetail/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/subCat/:id" element={<ProductListing />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </Suspense>

        <Footer />
      </BrowserRouter>
    </CartContextProvider>
  );
}

export default App;
