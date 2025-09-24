import React from "react";
import { Link } from "react-router-dom";
import "../style/main.scss";

export default function Registro(){
    return (
        <section class="form-container">
            <div class="form-header">
                <img src="../assets/logo.png" alt="BiteBack Logo" class="form-logo"/>
                    <h2>Registro de Usuario</h2>
            </div>

            <form id="formRegistro">
                <input type="text" id="Nombre" placeholder="Nombre completo" required />
                <input type="email" id="Correo" placeholder="Correo electrónico" required />
                <input type="password" id="password" placeholder="Contraseña" required />
                <input type="password" id="Confirmar" placeholder="Confirmar Contraseña" required />
                <select id="tipoUsuario" required>
                    <option value="">Selecciona tipo de Usuario</option>
                    <option value="Usuario">Usuario</option>
                    <option value="Administrador">Administrador</option>
                </select>
                <button type="submit">Registrarse</button>
            </form>

            <p>
                <Link to="/login" class="btn-primary">Iniciar sesión</Link>
            </p>
            <p>
                <Link to="/" class="btn-secondary">Volver</Link>
            </p>

        </section>
    )
};