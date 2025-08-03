import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from './components/footer/Footer'
import Navbar from './components/navbar/Navbar'
import Home from './pages/home/Home'
import ProductDetail from './pages/productDetail/ProductDetail';
import Cart from './pages/cart/Cart';
import ProductListing from './pages/productListing/ProductListing';
import Search from './components/search';

function App() {
 
  return (
    <>
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route exact path='/' element={<Home />}/>
        <Route path='/productdetail/:id' element={<ProductDetail/>} />
        <Route path='/cart' element={<Cart/>} />
        <Route path='/subCat/:id' element={<ProductListing/>} />
        <Route path='/search' element={<Search/>} />
      </Routes>
      <Footer/>
    </BrowserRouter>
    </>
  )
}

export default App
