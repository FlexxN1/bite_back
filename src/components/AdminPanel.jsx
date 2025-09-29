import React, { useState, useEffect } from "react";
import { API_URL } from "../config";

export default function AdminPanel({ user }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    const [productos, setProductos] = useState([]);
    const [compras, setCompras] = useState([]);

    // ================================
    // Obtener productos del admin
    // ================================
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await fetch(`${API_URL}/productos-auth`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setProductos(data);
            } catch (err) {
                console.error("❌ Error al cargar productos del admin:", err);
            }
        };
        fetchProductos();
    }, [user.id]);

    // ================================
    // Obtener compras (ordenes de usuarios)
    // ================================
    const fetchCompras = async () => {
        try {
            const res = await fetch(`${API_URL}/compras`);
            const data = await res.json();
            // Filtramos solo las compras que tienen productos del admin
            const filtradas = data.filter((c) => c.vendedor_id === user.id);
            setCompras(filtradas);
        } catch (err) {
            console.error("❌ Error al cargar compras:", err);
        }
    };

    useEffect(() => {
        fetchCompras();
    }, [user.id]);

    // ================================
    // Crear producto
    // ================================
    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/productos-auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    imagen_url: imagenUrl,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert("✅ Producto creado correctamente");
                setNombre("");
                setDescripcion("");
                setPrecio("");
                setStock("");
                setImagenUrl("");
                setProductos([...productos, data]);
            } else {
                alert(`❌ Error: ${data.error || "No se pudo crear el producto"}`);
            }
        } catch (err) {
            console.error(err);
            alert("❌ Error en el servidor");
        }
    };

    // ================================
    // Eliminar producto
    // ================================
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

        try {
            const res = await fetch(`${API_URL}/productos-auth/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                alert("✅ Producto eliminado correctamente");
                setProductos(productos.filter((p) => p.id !== id));
            } else {
                alert(`❌ Error: ${data.error || "No se pudo eliminar el producto"}`);
            }
        } catch (err) {
            console.error("❌ Error al eliminar producto:", err);
            alert("Error en el servidor");
        }
    };

    // ================================
    // Cambiar estado_envio
    // ================================
    const cambiarEstadoEnvio = async (detalleId, nuevoEstado) => {
        try {
            const res = await fetch(`${API_URL}/compras/detalle/${detalleId}/estado-envio`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado_envio: nuevoEstado }),
            });

            if (res.ok) {
                alert("✅ Estado de envío actualizado");
                fetchCompras(); // refrescar la lista
            } else {
                alert("❌ Error al actualizar estado de envío");
            }
        } catch (error) {
            console.error("Error actualizando estado de envío:", error);
        }
    };

    return (
        <div className="admin-layout">
            {/* =======================
                Aside izquierdo: Órdenes
            ======================= */}
            <aside className="admin-orders">
                <h3>Órdenes de usuarios</h3>
                {compras.length > 0 ? (
                    <ul>
                        {compras.map((c) => (
                            <li key={c.detalle_id}>
                                <p><strong>Usuario:</strong> {c.usuario_nombre}</p>
                                <p><strong>Ciudad:</strong> {c.ciudad}</p>
                                <p><strong>Dirección:</strong> {c.direccion}</p>
                                <p><strong>Producto:</strong> {c.producto_nombre}</p>
                                <p><strong>Cantidad:</strong> {c.cantidad}</p>
                                <p><strong>Total:</strong> 💲{c.precio_unitario * c.cantidad}</p>

                                {/* Estado de pago (solo mostrar, no editable) */}
                                <p><strong>Estado de pago:</strong> {c.estado_pago}</p>

                                {/* Estado de envío (editable por admin) */}
                                <p><strong>Estado de envío:</strong></p>
                                <select
                                    value={c.estado_envio || "Pendiente"}
                                    onChange={(e) =>
                                        cambiarEstadoEnvio(c.detalle_id, e.target.value)
                                    }
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="En camino">En camino</option>
                                    <option value="Por llegar">Por llegar</option>
                                    <option value="Entregado">Entregado</option>
                                </select>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No hay órdenes aún.</p>
                )}
            </aside>

            {/* =======================
                Centro: Formulario
            ======================= */}
            <div className="admin-panel">
                <h3>Gestión de Productos</h3>
                <form onSubmit={crearProducto}>
                    <input
                        type="text"
                        placeholder="Nombre del producto"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                    />
                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="URL de la imagen"
                        value={imagenUrl}
                        onChange={(e) => setImagenUrl(e.target.value)}
                    />
                    <button type="submit" className="btn-primary">
                        Publicar producto
                    </button>
                </form>
            </div>

            {/* =======================
                Aside derecho: Productos publicados
            ======================= */}
            <aside className="admin-products">
                <h3>Productos de {user.nombre}</h3>
                {productos.length > 0 ? (
                    <ul>
                        {productos.map((p) => (
                            <li key={p.id} className="producto-card">
                                <div className="producto-info">
                                    <p><strong>{p.nombre}</strong></p>
                                    <p>{p.descripcion}</p>
                                    <p>💲 {p.precio}</p>
                                    <p>Stock: {p.stock}</p>
                                    {p.imagen_url && (
                                        <img src={p.imagen_url} alt={p.nombre} />
                                    )}
                                </div>
                                <button
                                    className="btn-delete"
                                    onClick={() => eliminarProducto(p.id)}
                                >
                                    ✖
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No tienes productos publicados aún.</p>
                )}
            </aside>
        </div>
    );
}
