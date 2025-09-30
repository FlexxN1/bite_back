import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AppContext from "@context/AppContext";
import "../style/PrivateRoute.scss"; // 👈 estilos propios

export default function PrivateRoute({ children }) {
    const { user, loading } = useContext(AppContext);

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner" />
                <p>Validando sesión...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
