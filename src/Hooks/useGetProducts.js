import { useEffect, useState } from "react";
import api from "../services/apiClient";

const useGetProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/productos"); // 👈 usa apiClient
        setProducts(response.data || []);
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
