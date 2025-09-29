import React, { useContext, useState } from "react";
import "../style/adminPanel.scss";
import { useNavigate } from "react-router-dom";
import AdminPanel from "@components/AdminPanel";
import UserPanel from "@components/UserPanel";
import "../style/perfil.scss";
import AppContext from "@context/AppContext";
import api from "../services/apiClient"; // 👈 usamos el cliente con refresh automático
import { toast } from "../utils/toast";

export default function Perfil() {
    const { user, logout, login } = useContext(AppContext);
    const navigate = useNavigate();

    const [editMode, setEditMode] = useState(false);
    const [nombre, setNombre] = useState(user?.nombre || "");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            toast.fire({ icon: "error", title: "❌ El nombre no puede estar vacío" });
            return;
        }

        if (password && password !== confirmar) {
            toast.fire({ icon: "error", title: "❌ Las contraseñas no coinciden" });
            return;
        }

        try {
            const response = await api.put(`/usuarios/${user.id}`, {
                nombre,
                password: password || undefined,
                email: user.email,
                tipo_usuario: user.tipo_usuario,
            });

            if (response.data?.user) {
                toast.fire({ icon: "success", title: "✅ Perfil actualizado" });

                // 🔥 Actualizar user en contexto
                login(response.data.user, {
                    accessToken: localStorage.getItem("accessToken"),
                    refreshToken: localStorage.getItem("refreshToken"),
                });

                setEditMode(false);
                setPassword("");
                setConfirmar("");
            }
        } catch (err) {
            console.error("❌ Error al actualizar perfil:", err);
            toast.fire({
                icon: "error",
                title: "❌ No se pudo actualizar",
            });
        }
    };

    return (
        <section className="perfil-container">
            <h2>Perfil de {user.tipo_usuario}</h2>

            {!editMode ? (
                <>
                    <div className="perfil-info">
                        <p><strong>Nombre:</strong> {user.nombre}</p>
                        <p><strong>Correo:</strong> {user.email}</p>
                        <p><strong>Tipo:</strong> {user.tipo_usuario}</p>
                    </div>

                    {/* 👉 Render según el tipo de usuario */}
                    {user.tipo_usuario === "Administrador" ? (
                        <AdminPanel />
                    ) : (
                        <UserPanel user={user} />
                    )}

                    <div className="acciones-perfil">
                        <button
                            onClick={() => setEditMode(true)}
                            className="btn-primary"
                        >
                            Editar perfil
                        </button>
                    </div>
                </>
            ) : (
                <div className="perfil-form">
                    <h3>Editar Información</h3>
                    <input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Nuevo nombre"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nueva contraseña (opcional)"
                    />
                    <input
                        type="password"
                        value={confirmar}
                        onChange={(e) => setConfirmar(e.target.value)}
                        placeholder="Confirmar contraseña"
                    />

                    <div className="perfil-buttons">
                        <button onClick={handleSave} className="btn-primary">
                            Guardar cambios
                        </button>
                        <button
                            onClick={() => setEditMode(false)}
                            className="btn-secondary"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            <button
                onClick={handleLogout}
                className="btn-secondary cerrar-sesion"
            >
                Cerrar sesión
            </button>
        </section>
    );
}
