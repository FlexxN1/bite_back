import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/login.scss";
import logo from "@assets/logo.png"

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:4000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: correo, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // guardar token si tu backend lo envía
                if (data.token) {
                    localStorage.setItem("token", data.token);
                }
                alert("✅ Inicio de sesión exitoso");
                console.log("Usuario:", data);
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (error) {
            console.error("Error en login:", error);
            alert("❌ Error en el servidor");
        }
    };

    return (
        <section className="form-container">
            <div className="form-header">
                <img
                    src={logo}
                    alt="BiteBack Logo"
                    className="form-logo"
                />
            </div>

            <section className="form-container__form">
                <h2>Iniciar Sesión</h2>
                <form id="formLogin" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        id="Correo"
                        placeholder="Correo electrónico"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        id="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button type="submit" className="btn-primary">
                        Ingresar
                    </button>
                </form>

                <p>
                    ¿No tienes cuenta?{" "}
                    <Link to="/registro" className="btn-primary">
                        Regístrate
                    </Link>
                </p>
                <p>
                    <Link to="/" className="btn-secondary">
                        Volver
                    </Link>
                </p>
            </section>
        </section>
    );
}
