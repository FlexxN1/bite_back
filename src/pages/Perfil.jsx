import React from "react";
import { Link } from "react-router-dom";
import "../style/Header.scss";

export default function Perfil() {
    return (
        <section class="form-container">
            <h2>Perfil de Usuario</h2>
            <p><strong>Nombre:</strong> <span id="nombrePerfil"></span></p>
            <p><strong>Correo:</strong> <span id="correoPerfil"></span></p>
            <p><strong>Tipo:</strong> <span id="tipoPerfil"></span></p>
            <button id="cerrarSesion"><Link to="/">Cerrar sesión</Link></button>
        </section>
    )
}