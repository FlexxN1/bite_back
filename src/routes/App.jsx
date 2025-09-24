import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import Login from "@pages/Login";
import Registro from "@pages/Registro";
import Home from "@pages/Home";
import Users from "@pages/Users";
import Perfil from "@pages/Perfil";
import Products from "@pages/Products";
import "../index.scss";

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/users" element={<Users />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/products" element={<Products />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}