import React, { useEffect, useState } from "react";

export default function UserPanel({ user }) {
    const [compras, setCompras] = useState([]);

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const res = await fetch(`http://localhost:4000/compras/${user.id}`);
                const data = await res.json();
                setCompras(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchCompras();
    }, [user.id]);

    return (
        <div className="user-panel">
            <h3>Historial de Compras</h3>
            {compras.length > 0 ? (
                <ul>
                    {compras.map((compra) => (
                        <li key={compra.id}>
                            <p><strong>Fecha:</strong> {new Date(compra.fecha_compra).toLocaleDateString()}</p>
                            <p><strong>Total:</strong> ${compra.total}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tienes compras registradas.</p>
            )}
        </div>
    );
}
