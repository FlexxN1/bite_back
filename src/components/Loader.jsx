import React from "react";
import "../style/Loader.scss";

const Loader = () => {
    return (
        <div className="loader-container">
            <div className="spinner"></div>
            <p>Cargando productos...</p>
        </div>
    );
};

export default Loader;
