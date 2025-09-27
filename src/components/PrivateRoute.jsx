// src/components/PrivateRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "@context/AppContext";

export default function PrivateRoute({ children }) {
    const { user } = useContext(AppContext);

    if (user === null) {
        return <p style={{ textAlign: "center" }}>Verificando sesión...</p>;
    }

    return user ? children : <Navigate to="/login" />;
}
