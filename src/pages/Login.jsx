import React from "react";
import { Link } from "react-router-dom";
import "../style/main.scss";

export default function Home() {
    return (
        <section className="form-container">
            <div className="form-header">
                <img src="../assets/logo.png" alt="BiteBack Logo" classNameName="form-logo"/>
                    <h2></h2>
            </div>
            <section classNameName="form-container">
                <h2>Iniciar Sesión</h2>
                <form id="formLogin">
                    <input type="email" id="Correo" placeholder="Correo electrónico" required />
                    <input type="password" id="password" placeholder="Contraseña" required />
                    <button type="submit" className="btn-primary">Ingresar</button>
                </form>
                <p>¿No tienes cuenta?
                    <Link to="/registro" className="btn-primary">Regístrate</Link>
                </p>
                <p>
                    <Link to="/" className="btn-secondary">Volver</Link>
                </p>
            </section>
        </section>
    );
}