import React from "react";
import "../style/main.scss";

export default function Perfil() {
    return (
        <section class="form-container">
            <h2>Perfil de Usuario</h2>
            <p><strong>Nombre:</strong> <span id="nombrePerfil"></span></p>
            <p><strong>Correo:</strong> <span id="correoPerfil"></span></p>
            <p><strong>Tipo:</strong> <span id="tipoPerfil"></span></p>
            <button id="cerrarSesion">Cerrar sesión</button>
        </section>
    )
}