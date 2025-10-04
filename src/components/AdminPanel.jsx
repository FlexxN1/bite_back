import React, { useState, useEffect, useContext } from "react";
import { io } from "socket.io-client";
import AppContext from "@context/AppContext";
import api from "../services/apiClient"; // 👈 cliente con refresh automático
import { API_URL, cloudName, uploadPreset } from "../config";
import { toast } from "../utils/toast";

export default function AdminPanel() {
    const { user } = useContext(AppContext); // 👈 sacamos user desde contexto

    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagenes, setImagenes] = useState([]); // ✅ soporte múltiples imágenes
    const [subiendo, setSubiendo] = useState(false);
    const [productos, setProductos] = useState([]);
    const [compras, setCompras] = useState([]);

    const [loadingCompras, setLoadingCompras] = useState(false);
    const [loadingProductos, setLoadingProductos] = useState(false);

    // ================================
    // WebSocket (Socket.IO)
    // ================================
    useEffect(() => {
        const socket = io(API_URL);

        socket.on("connect", () => {
            console.log("🟢 Conectado a WebSocket:", socket.id);
        });

        socket.on("estadoEnvioActualizado", (data) => {
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

        // 🆕 Actualización en tiempo real del pago
        socket.on("estadoPagoActualizado", (data) => {
            setCompras((prev) =>
                prev.map((c) =>
                    c.compra_id === Number(data.compraId)
                        ? { ...c, estado_pago: data.estado_pago }
                        : c
                )
            );
        });

        socket.on("nuevaCompra", () => {
            setLoadingCompras(true);
            fetchCompras().finally(() => setLoadingCompras(false));
        });

        socket.on("compraFinalizada", (data) => {
            setCompras((prev) => prev.filter((c) => c.compra_id !== data.compraId));
        });

        return () => socket.disconnect();
    }, []);

    // ================================
    // Obtener productos
    // ================================
    useEffect(() => {
        const fetchProductos = async () => {
            setLoadingProductos(true);
            try {
                const { data } = await api.get("/productos-auth");
                setProductos(data);
            } catch (err) {
                console.error("❌ Error al cargar productos del admin:", err);
            } finally {
                setLoadingProductos(false);
            }
        };
        if (user?.id) fetchProductos();
    }, [user?.id]);

    // ================================
    // Obtener compras
    // ================================
    const fetchCompras = async () => {
        setLoadingCompras(true);
        try {
            const { data } = await api.get("/compras");

            const filtradas = data
                .map((c) => ({
                    ...c,
                    productos: c.productos.filter(
                        (p) => p.vendedor_id === user.id && p.estado_envio !== "Entregado"
                    ),
                }))
                .filter((c) => c.productos.length > 0);

            setCompras(filtradas);
        } catch (err) {
            console.error("❌ Error al obtener compras:", err);
        } finally {
            setLoadingCompras(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchCompras();
    }, [user?.id]);

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

            if (nuevoEstado === "Entregado") {
                setCompras((prev) =>
                    prev
                        .map((c) => ({
                            ...c,
                            productos: c.productos.filter(
                                (p) => p.detalle_id !== detalleId
                            ),
                        }))
                        .filter((c) => c.productos.length > 0)
                );
            } else {
                fetchCompras();
            }
        } catch (error) {
            console.error("Error actualizando estado de envío:", error);
            toast.fire({ icon: "error", title: "❌ No se pudo actualizar" });
        }
    };

    // ================================
    // Subir imágenes múltiples
    // ================================
    const uploadImages = async (files) => {
        setSubiendo(true);
        try {
            const urls = [];
            for (let file of files) {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("upload_preset", uploadPreset);

                const res = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    { method: "POST", body: formData }
                );
                const data = await res.json();
                urls.push(data.secure_url);
            }
            setImagenes((prev) => [...prev, ...urls]);
            toast.fire({ icon: "success", title: "✅ Imagen(es) subida(s) correctamente" });
        } catch (err) {
            console.error("❌ Error subiendo imágenes:", err);
            toast.fire({ icon: "error", title: "❌ No se pudieron subir las imágenes" });
        } finally {
            setSubiendo(false);
        }
    };

    // ================================
    // Crear producto
    // ================================
    const crearProducto = async (e) => {
        e.preventDefault();

        if (!nombre || !descripcion || !precio || !stock) {
            toast.fire({ icon: "warning", title: "⚠️ Completa todos los campos" });
            return;
        }
        if (Number(stock) <= 0) {
            toast.fire({ icon: "error", title: "❌ El stock debe ser mayor" });
            return;
        }
        if (imagenes.length === 0) {
            toast.fire({ icon: "warning", title: "⚠️ Debes subir al menos una imagen" });
            return;
        }
        if (subiendo) {
            toast.fire({ icon: "info", title: "⏳ Espera a que las imágenes terminen de subir" });
            return;
        }

        setLoadingProductos(true);

        try {
            const { data } = await api.post("/productos-auth", {
                nombre,
                descripcion,
                precio,
                stock,
                imagenes, // ✅ array de imágenes
            });

            toast.fire({ icon: "success", title: "✅ Producto creado correctamente" });
            setProductos((prev) => [...prev, data]);

            // Reset
            setNombre("");
            setDescripcion("");
            setPrecio("");
            setStock("");
            setImagenes([]);
        } catch (err) {
            console.error("❌ Error creando producto:", err);
            toast.fire({ icon: "error", title: "❌ Error al crear producto" });
        } finally {
            setLoadingProductos(false);
        }
    };

    return (
        <div className="admin-layout">
            {/* Aside izquierdo */}
            <aside className="admin-orders">
                <h3>Ordenes de usuarios</h3>
                {loadingCompras ? (
                    <div className="aside-loader">
                        <div className="spinner"></div>
                    </div>
                ) : compras.length > 0 ? (
                    <ul>
                        {compras.map((c) =>
                            c.productos.map((p) => (
                                <li key={p.detalle_id}>
                                    <p><strong>Usuario:</strong> {c.usuario_nombre}</p>
                                    <p><strong>Ciudad:</strong> {c.ciudad}</p>
                                    <p><strong>Dirección:</strong> {c.direccion}</p>
                                    <p><strong>Producto:</strong> {p.nombre}</p>
                                    <p><strong>Teléfono:</strong> {c.telefono}</p>
                                    <p><strong>Fecha compra: </strong>{c.fecha_compra}</p>
                                    <p><strong>Cantidad:</strong> {p.cantidad}</p>
                                    <p><strong>Total:</strong> 💲 {Number(p.precio_unitario * p.cantidad).toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                    })}</p>
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

            {/* Centro: Formulario */}
            <div className="admin-panel">
                <h3>Gestión de Productos</h3>
                <form onSubmit={crearProducto}>
                    <input
                        type="text"
                        placeholder="Nombre del producto"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <textarea
                        placeholder="Descripción"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Precio"
                        value={precio}
                        onChange={(e) => setPrecio(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />

                    <label className="upload-btn">
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            multiple // ✅ varias imágenes
                            onChange={(e) => {
                                const files = Array.from(e.target.files);
                                if (files.length > 0) uploadImages(files);
                            }}
                        />
                        {subiendo ? "⏳ Subiendo..." : "📷 Seleccionar imágenes"}
                    </label>

                    {(subiendo || imagenes.length > 0) && (
                        <>
                            <div className="preview-area">
                                {subiendo && <div className="spinner"></div>}

                                {imagenes.length > 0 && !subiendo && (
                                    <div className="preview-multi">
                                        {imagenes.map((img, idx) => (
                                            <div className="preview-wrapper" key={idx}>
                                                <img src={img} alt={`Vista previa ${idx}`} />
                                                <button
                                                    type="button"
                                                    className="btn-remove-image"
                                                    onClick={() =>
                                                        setImagenes((prev) =>
                                                            prev.filter((_, i) => i !== idx)
                                                        )
                                                    }
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="container-btn__submit">

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={subiendo}
                                >
                                    {subiendo ? "Cargando..." : "Publicar producto"}
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>

            {/* Aside derecho */}
            <aside className="admin-products">
                <h3>Productos de {user?.nombre}</h3>
                {loadingProductos ? (
                    <div className="aside-loader">
                        <div className="spinner"></div>
                    </div>
                ) : productos.length > 0 ? (
                    <ul>
                        {productos.map((p) => (
                            <li key={p.id} className="producto-card">
                                <div className="producto-info">
                                    <p><strong>{p.nombre}</strong></p>
                                    <p>{p.descripcion}</p>
                                    <p>💲 {Number(p.precio).toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                    })}</p>
                                    <p>Stock: {p.stock}</p>
                                    {/* ✅ múltiples imágenes */}
                                    {p.imagenes?.map((img, idx) => (
                                        <img key={idx} src={img} alt={`${p.nombre}-${idx}`} />
                                    ))}
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
