import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanel from "@components/AdminPanel";
import UserPanel from "@components/UserPanel";
import "../style/perfil.scss";
import AppContext from "@context/AppContext";

export default function Perfil() {
    const { user, logout } = useContext(AppContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };


    return (
        <section className="perfil-container">
            <h2>Perfil de {user.tipo_usuario}</h2>
            <p><strong>Nombre:</strong> {user.nombre}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Tipo:</strong> {user.tipo_usuario}</p>

            {/* Render dinámico */}
            {user.tipo_usuario === "Administrador" ? (
                <AdminPanel user={user} />
            ) : (
                <UserPanel user={user} />
            )}

            <button onClick={handleLogout} className="btn-secondary">
                Cerrar sesión
            </button>
            <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(-1)}
            >
                Volver atrás
            </button>
        </section>
    );
}
