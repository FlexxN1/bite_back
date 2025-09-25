import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../style/main.scss";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token"); // si usas login con token
        const response = await fetch(
          "https://webhook.latenode.com/79099/prod/7f81d6f6-303e-4e2b-9e51-02184a5f6d78",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // 👇 Latecode devuelve { success: true, productos: [...] }
          setProducts(data.productos || []);
        } else {
          console.error("❌ Error desde servidor:", data);
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
      <div className="row">
        {products.length > 0 ? (
          products.map((p) => (
            <div key={p.id} className="col-md-4 mb-3">
              <div className="card h-100">
                <img
                  src={p.imagen_url || "https://via.placeholder.com/200"}
                  alt={p.nombre}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.nombre}</h5>
                  <p className="card-text">
                    {p.descripcion
                      ? p.descripcion.substring(0, 80)
                      : "Sin descripción"}
                    ...
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
