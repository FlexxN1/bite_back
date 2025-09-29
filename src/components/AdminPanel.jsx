import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AppContext from "@context/AppContext";
import api from "../services/apiClient"; // 👈 cliente con refresh automático
import { API_URL } from "../config";
import { toast } from "../utils/toast";

export default function AdminPanel() {
    const { user } = useContext(AppContext); // 👈 sacamos user desde contexto

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    const [productos, setProductos] = useState([]);
    const [compras, setCompras] = useState([]);

    // ================================
    // WebSocket (Socket.IO)
    // ================================
    useEffect(() => {
        const socket = io(API_URL);

        socket.on("connect", () => {
            console.log("🟢 Conectado a WebSocket:", socket.id);
        });

        // 🔥 Escuchar cambios de stock
        socket.on("stockActualizado", (data) => {
            setProductos((prev) =>
                prev.map((prod) =>
                    prod.id === data.productoId
                        ? { ...prod, stock: data.nuevoStock }
                        : prod
                )
            );
        });

        // 🔥 Escuchar cambios de estado de envío
        socket.on("estadoEnvioActualizado", (data) => {
            console.log("📦 Estado de envío actualizado en tiempo real:", data);

            setCompras((prev) =>
                prev.map((c) => ({
                    ...c,
                    productos: c.productos.map((p) =>
                        p.detalle_id === data.detalleId
                            ? { ...p, estado_envio: data.nuevoEstado }
                            : p
                    ),
                }))
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // ================================
    // Obtener productos del admin
    // ================================
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const { data } = await api.get("/productos-auth");
                setProductos(data);
            } catch (err) {
                console.error("❌ Error al cargar productos del admin:", err);
            }
        };
        if (user?.id) fetchProductos();
    }, [user?.id]);

    // ================================
    // Obtener compras (órdenes de usuarios)
    // ================================
    const fetchCompras = async () => {
        try {
            const { data } = await api.get("/compras"); // 👈 usamos api, no fetch

            // 🔑 Filtrar solo órdenes con productos del admin actual
            const filtradas = data
                .map((c) => ({
                    ...c,
                    productos: c.productos.filter((p) => p.vendedor_id === user.id),
                }))
                .filter((c) => c.productos.length > 0);

            setCompras(filtradas);
        } catch (err) {
            console.error("❌ Error al obtener compras:", err);
        }
    };

    useEffect(() => {
        if (user?.id) fetchCompras();
    }, [user?.id]);

    // ================================
    // Crear producto
    // ================================
    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post("/productos-auth", {
                nombre,
                descripcion,
                precio,
                stock,
                imagen_url: imagenUrl,
            });

            toast.fire({ icon: "success", title: "✅ Producto creado correctamente" });

            // 🔥 data ya viene con todos los campos (id, nombre, descripcion, precio, stock, etc.)
            setProductos((prev) => [...prev, data]);

            // limpiar inputs
            setNombre("");
            setDescripcion("");
            setPrecio("");
            setStock("");
            setImagenUrl("");
        } catch (err) {
            console.error(err);
            toast.fire({ icon: "error", title: "❌ Error al crear producto" });
        }
    };


    // ================================
    // Eliminar producto
    // ================================
    const eliminarProducto = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;

        try {
            await api.delete(`/productos-auth/${id}`);
            toast.fire({ icon: "success", title: "✅ Producto eliminado correctamente" });
            setProductos((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("❌ Error al eliminar producto:", err);
            toast.fire({ icon: "error", title: "❌ No se pudo eliminar" });
        }
    };

    // ================================
    // Cambiar estado_envio
    // ================================
    const cambiarEstadoEnvio = async (detalleId, nuevoEstado) => {
        try {
            await api.put(`/compras/detalle/${detalleId}/estado-envio`, {
                estado_envio: nuevoEstado,
            });
            toast.fire({ icon: "success", title: "✅ Estado de envío actualizado" });
            fetchCompras();
        } catch (error) {
            console.error("Error actualizando estado de envío:", error);
            toast.fire({ icon: "error", title: "❌ No se pudo actualizar" });
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
                        {compras.map((c) =>
                            c.productos.map((p) => (
                                <li key={p.detalle_id}>
                                    <p><strong>Usuario:</strong> {c.usuario_nombre}</p>
                                    <p><strong>Ciudad:</strong> {c.ciudad}</p>
                                    <p><strong>Dirección:</strong> {c.direccion}</p>
                                    <p><strong>Producto:</strong> {p.nombre}</p>
                                    <p><strong>Cantidad:</strong> {p.cantidad}</p>
                                    <p><strong>Total:</strong> 💲{p.precio_unitario * p.cantidad}</p>
                                    <p><strong>Estado de pago:</strong> {c.estado_pago}</p>

                                    <p><strong>Estado de envío:</strong></p>
                                    <select
                                        value={p.estado_envio || "Pendiente"}
                                        onChange={(e) =>
                                            cambiarEstadoEnvio(p.detalle_id, e.target.value)
                                        }
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="En camino">En camino</option>
                                        <option value="Por llegar">Por llegar</option>
                                        <option value="Entregado">Entregado</option>
                                    </select>
                                </li>
                            ))
                        )}
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
                <h3>Productos de {user?.nombre}</h3>
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
