import React, { useState } from "react";

export default function AdminPanel({ user }) {
    const [nombre, setNombre] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [precio, setPrecio] = useState("");
    const [stock, setStock] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    const crearProducto = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:4000/productos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    precio,
                    stock,
                    imagen_url: imagenUrl,
                    vendedor_id: user.id, // relaciona con admin
                }),
            });

            if (response.ok) {
                alert("✅ Producto creado correctamente");
                setNombre("");
                setDescripcion("");
                setPrecio("");
                setStock("");
                setImagenUrl("");
            } else {
                alert("❌ Error al crear producto");
            }
        } catch (err) {
            console.error(err);
            alert("❌ Error en el servidor");
        }
    };

    return (
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
    );
}
