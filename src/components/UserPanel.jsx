import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function UserPanel({ user }) {
    const [compras, setCompras] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const res = await fetch(`${API_URL}/compras`);
                const data = await res.json();

                // Filtrar compras del usuario actual
                const filtradas = data.filter((c) => c.usuario_id === user.id);
                setCompras(filtradas);
            } catch (err) {
                console.error("❌ Error al cargar compras:", err);
            }
        };

        if (user?.id) fetchCompras();
    }, [user]);

    return (
        <div className="user-panel">
            <h3>Historial de Compras</h3>

            {compras.length > 0 ? (
                <div className="historial">
                    {compras.map((compra) => (
                        <div key={compra.id} className="compra-card">
                            <p><strong>Fecha:</strong> {new Date(compra.fecha_compra).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> 💲{compra.total}</p>
                            <p><strong>Estado de pago:</strong> {compra.estado_pago}</p>

                            {compra.productos?.length > 0 && (
                                <ul>
                                    {compra.productos.map((p) => (
                                        <li key={p.detalle_id}>
                                            <p><strong>Producto:</strong> {p.nombre}</p>
                                            <p><strong>Cantidad:</strong> {p.cantidad}</p>
                                            <p><strong>Estado de envío:</strong> {p.estado_envio}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="historial-empty">
                    <p className="empty-title">Aún no tienes compras</p>
                    <p className="empty-desc">Cuando compres, tus pedidos aparecerán aquí.</p>
                    <button
                        className="btn-primary small"
                        onClick={() => navigate("/products")}
                    >
                        Ir a productos
                    </button>
                </div>
            )}
        </div>
    );
}
