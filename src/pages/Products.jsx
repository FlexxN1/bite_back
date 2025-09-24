import React, { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token"); // Token guardado en login
        const response = await fetch("http://localhost:4000/productos", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 🔑 enviamos el token
          },
        });

        const data = await response.json();

        if (response.ok) {
          setProducts(data);
        } else {
          alert("❌ Error: " + data.message);
        }
      } catch (error) {
        console.error("Error al obtener productos:", error);
        alert("❌ Error en el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) return <p className="text-center mt-4">Cargando productos...</p>;

  return (
    <div className="container mt-4">
      <h2>Productos</h2>
      <div className="row">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <img
                  src={p.image || "https://via.placeholder.com/200"}
                  alt={p.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text">
                    {p.descripcion ? p.descripcion.substring(0, 80) : "Sin descripción"}...
                  </p>
                  <p>
                    <strong>${p.precio}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay productos disponibles</p>
        )}
      </div>
    </div>
  );
}
