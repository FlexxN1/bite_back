import { useEffect, useState } from "react";
import {API_URL} from "../config"

const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(`${API_URL}/productos`);
        const data = await response.json();

        if (response.ok) {
          setProducts(data || []);
        } else {
          console.error("❌ Error en respuesta del servidor:", data);
        }
      } catch (error) {
        console.error("❌ Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { products, loading };
};

export default useGetProducts;
