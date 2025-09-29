import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/login.scss";
import logo from "@assets/logo.png";
import { API_URL } from "../config";
import AppContext from "@context/AppContext";
import { toast } from "../utils/toast";

export default function Login() {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: correo, password }),
            });

            const data = await response.json();

            if (response.ok && data.accessToken && data.refreshToken && data.user) {
                // ✅ Guardar tokens + usuario en contexto y localStorage
                login({
                    user: data.user,
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                });

                toast.fire({
                    icon: "success",
                    title: "✅ Inicio de sesión exitoso",
                });

                setTimeout(() => navigate("/perfil"), 1200);
            } else {
                toast.fire({
                    icon: "error",
                    title: `❌ ${data.error || data.message || "Credenciales inválidas"}`,
                });
            }
        } catch (error) {
            console.error("Error en login:", error);
            toast.fire({
                icon: "error",
                title: "❌ Error en el servidor",
            });
        }
    };

    return (
        <section className="form-container">
            <div className="form-header">
                <img src={logo} alt="BiteBack Logo" className="form-logo" />
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
