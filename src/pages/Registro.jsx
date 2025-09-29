import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/registro.scss";
import logo from "@assets/logo.png";
import { toast } from "../utils/toast";
import { API_URL } from "../config";
import AppContext from "@context/AppContext";

export default function Registro() {
    const { login } = useContext(AppContext);
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmar) {
            toast.fire({
                icon: "error",
                title: "❌ Las contraseñas no coinciden",
            });
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre,
                    email: correo,
                    password,
                    tipo_usuario: tipoUsuario,
                }),
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
                    title: "✅ Registro exitoso",
                });

                setTimeout(() => navigate("/perfil"), 1200);
            } else {
                toast.fire({
                    icon: "error",
                    title: `❌ ${data.error || data.message || "Error desconocido"}`,
                });
            }
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            toast.fire({
                icon: "error",
                title: "❌ Error en el servidor",
            });
        }
    };

    return (
        <section className="form-container-registro">
            <div className="form-header-registro">
                <img src={logo} alt="BiteBack Logo" className="form-logo" />
                <h2>Registro de Usuario</h2>
            </div>

            <form id="formRegistro" className="form-registro" onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="Nombre"
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
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
                <input
                    type="password"
                    id="Confirmar"
                    placeholder="Confirmar Contraseña"
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                />
                <select
                    id="tipoUsuario"
                    value={tipoUsuario}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    required
                >
                    <option value="">Selecciona tipo de Usuario</option>
                    <option value="Cliente">Usuario</option>
                    <option value="Administrador">Administrador</option>
                </select>

                <button type="submit">Registrarse</button>
            </form>

            <div className="form-registro-links">
                <p>
                    <Link to="/login" className="btn-primary">
                        Iniciar sesión
                    </Link>
                </p>
                <p>
                    <Link to="/" className="btn-secondary">
                        Volver
                    </Link>
                </p>
            </div>
        </section>
    );
}
