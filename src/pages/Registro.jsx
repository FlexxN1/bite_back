import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../style/registro.scss"; // 👈 nuevo scss
import logo from "@assets/logo.png";

export default function Registro() {
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [tipoUsuario, setTipoUsuario] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmar) {
            alert("❌ Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch(
                "https://webhook.latenode.com/79099/prod/7f81d6f6-303e-4e2b-9e51-02184a5f6d78",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        nombre,
                        email: correo,
                        password,
                        tipoUsuario,
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("✅ Registro exitoso");
                console.log("Usuario registrado:", data);
            } else {
                alert("❌ Error: " + data.message);
            }
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("❌ Error en el servidor");
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
                    <option value="Usuario">Usuario</option>
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
