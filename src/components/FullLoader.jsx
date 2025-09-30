// src/components/FullLoader.jsx
import React from "react";
import "../style/FullLoader.scss";

export default function FullLoader() {
    return (
        <div className="full-loader">
            <div className="spinner"></div>
            <p>Cargando sesión...</p>
        </div>
    );
}
