import React, { useEffect, useState } from "react";
/*import axios from 'axios';*/

const useGetProducts = (API) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Simulación de API (con datos locales o fetch real)
        const data = API;
        setTimeout(() => {
          setProducts(data.productos || []);
          setLoading(false);
        }, 1500); // ⏳ delay para que veas el loader
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);





    /* 
      if (loading) return <p className="text-center mt-4">Cargando productos...</p>;
    
    useEffect(async () => {
        const response = await axios(API);
        setProducts(response.data);
    }, []) La forma planteada en el curso, tambien funciona. siemrpe y cuando le demos un KEY al componente 'productList' */

     /*useEffect(() => {
        const fetchProductos = async () => {
          try {
            const token = localStorage.getItem("token"); // si usas login con token
            const response = await fetch(API,
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
      }, []);*/

    /*useEffect(() => {
        async function fetchData() {
            const response = await axios.get(API);
            setProducts(response.data);
        }
        fetchData();
    }, []);*/

    return {products, loading};
};

export default useGetProducts;