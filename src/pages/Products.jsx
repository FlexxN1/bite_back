import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Productos</h2>
      <div className="row">
        {products.map(p => (
          <div key={p.id} className="col-md-4 mb-3">
            <div className="card h-100">
              <img src={p.image} alt={p.title} className="card-img-top" style={{ height: "200px", objectFit: "contain" }} />
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.description.substring(0, 80)}...</p>
                <p><strong>${p.price}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}