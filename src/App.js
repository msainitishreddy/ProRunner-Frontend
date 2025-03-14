import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import  Cart from "./pages/Cart.js";
import Login from './pages/Login';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist.js';
function App() {

  return (
    <Router>
      <Header/>
      <Routes>
        <Route path="/cart/:cartId" Component={<Cart />} />
        <Route path="/" element={<Home/>} />
        <Route path="/shop" element={<Shop/>} />
        <Route path="/wishlist" element={<Wishlist/>} />
        <Route path="/cart" element={<Cart/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
