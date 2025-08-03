import { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./pages/sidebar/Sidebar";
import Dashboard from "./pages/dashboard/Dashboard";
import AddCategory from "./pages/category/AddCategory";
import ViewCategory from "./pages/category/ViewCategory";
import AddSubCategory from "./pages/subCategory/AddSubCategory";
import ViewSubCategory from "./pages/subCategory/ViewSubCategory";
import AddProduct from "./pages/product/AddProduct";
import ViewProduct from "./pages/product/ViewProduct";
import "./App.css";

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

export const myContext = createContext();

function App() {
  const [alertBox, setAlertBox] = useState({
    msg: '',
    error: false,
    open: false,
  });

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setAlertBox({ ...alertBox, open: false });
  };

  const contextValue = {
    alertBox,
    setAlertBox,
  };

  return (
    <myContext.Provider value={contextValue}>
      <Router>
    
        <Snackbar
          open={alertBox.open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity={alertBox.error ? "error" : "success"}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertBox.msg}
          </Alert>
        </Snackbar>


        <div className="admin-panel">
          <Sidebar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-category" element={<AddCategory />} />
              <Route path="/view-category" element={<ViewCategory />} />
              <Route path="/add-subcategory" element={<AddSubCategory />} />
              <Route path="/view-subcategory" element={<ViewSubCategory />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/view-product" element={<ViewProduct />} />
            </Routes>
          </div>
        </div>
      </Router>
    </myContext.Provider>
  );
}

export default App;
