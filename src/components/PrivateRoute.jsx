// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "@context/AppContext";

export default function PrivateRoute({ children }) {
    const { user } = useContext(AppContext);

    // Si no hay usuario logueado, redirige directamente al login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
