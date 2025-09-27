import React from 'react';
import { Routes, Route } from "react-router-dom";
import Footer from "@components/Footer";
import Login from "@pages/Login";
import Registro from "@pages/Registro";
import Home from "@pages/Home";
import Users from "@pages/Users";
import Products from "@components/ProductList";
import Perfil from "@pages/Perfil";
import Navbar from '@components/Navbar';
import useInitialState from '../Hooks/useInitialState';
import Checkout from '../pages/Checkout';
import AppContext from '@context/AppContext';

import "../index.scss";


export default function App() {
  const initialState = useInitialState();
  return (
    <AppContext.Provider value={initialState}>
      <div className="app-container">
        <main>
          <Routes>
            <Route path="/" element={<><Navbar/><Home/></>} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/users" element={<Users />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products" element={<><Navbar /><Products /></>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppContext.Provider>
  );
}