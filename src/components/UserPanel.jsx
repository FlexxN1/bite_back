import React, { useState, useEffect, useContext } from "react";
import { API_URL } from "../config";
import "../style/usePanel.scss"
import AppContext from "@context/AppContext";

export default function UserPanel({ user }) {
    const { logout } = useContext(AppContext);
    const [compras, setCompras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) {
            console.warn("⚠️ No hay user.id todavía");
            return;
        }

        const fetchCompras = async () => {
            try {
                const res = await fetch(`${API_URL}/compras`);
                const data = await res.json();

                const filtradas = data.filter(
                    (c) => Number(c.usuario_id) === Number(user.id)
                );

                setCompras(filtradas);
            } catch (err) {
                console.error("❌ Error al cargar compras:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCompras();
    }, [user?.id]);

    // 👇 Mostrar mientras no haya user.id
    if (!user?.id) {
        return (
            <section className="user-panel p-4 bg-white rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-3">Historial de Compras</h3>
                <p>Cargando usuario...</p>
            </section>
        );
    }

    return (
        <section className="user-panel">
            <h3 className="user-panel__title">Historial de Compras</h3>

            {loading ? (
                <p className="user-panel__loading">Cargando compras...</p>
            ) : compras.length > 0 ? (
                <ul className="user-panel__list">
                    {compras.map((c) => (
                        <li key={c.compra_id} className="compra-card">
                            <p><strong>Fecha:</strong> {c.fecha_compra ? new Date(c.fecha_compra).toLocaleDateString() : "Sin fecha"}</p>
                            <p><strong>Total:</strong> ${c.total}</p>
                            <p><strong>Estado de pago:</strong> {c.estado_pago}</p>

                            <div className="compra-card__productos">
                                <h4>Productos:</h4>
                                <ul>
                                    {c.productos?.map((p) => (
                                        <li key={p.producto_id}>
                                            <span className="producto-nombre">{p.nombre}</span>
                                            <span className="producto-cantidad">(x{p.cantidad})</span>
                                            <span className="producto-precio"> - ${p.precio_unitario}</span>
                                            <br />
                                            <span className="producto-estado">Estado de envío: {p.estado_envio}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="user-panel__empty">No tienes compras registradas aún.</p>
            )}
        </section>
    );
}
