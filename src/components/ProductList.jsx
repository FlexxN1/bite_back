import React, { useState } from 'react';
import ProductItem from '@components/ProductItem';
import useGetProducts from '../Hooks/useGetProducts';
import Loader from '@components/Loader'; 
import '../style/ProductList.scss';
import "../style/Header.scss";



const productos = {
    "productos": [
      {
        "id": 1,
        "nombre": "Aguacate Hass",
        "descripcion": "Aguacate fresco de exportación",
        "precio": "5000.00",
        "imagen_url": "https://example.com/imagenes/aguacate_hass.jpg",
        "stock": 100,
        "vendedor_id": 3,
        "fecha_creacion": "2025-09-25T01:56:41.000Z"
      },
      {
        "id": 2,
        "nombre": "Aguacate Criollo",
        "descripcion": "Pequeño pero muy sabroso",
        "precio": "3500.00",
        "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
        "stock": 50,
        "vendedor_id": 4,
        "fecha_creacion": "2025-09-25T01:56:41.000Z"
      },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
              {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
              {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
              {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
             {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
              {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
              {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
              {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 50,
            "vendedor_id": 4,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        }
    ]
  }


const ProductList = () => {
    const {products, loading} = useGetProducts(productos);

    const [selectedProduct, setSelectedProduct] = useState(null);

    const openProduct = (product) => {
        setSelectedProduct(product);
        //setToggleOrders(false);
    };

    const closeProduct = () => setSelectedProduct(null);

    return (
        <section className="main-container">
            {loading ? (
                <Loader />
            ) : (
                <div className="ProductList">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductItem
                                key={product.id}
                                product={product}
                                isOpen={selectedProduct?.id === product.id}
                                openProduct={() => openProduct(product)}
                                closeProduct={closeProduct}
                            />
                        ))
                    ) : (
                        <p>No hay productos disponibles</p>
                    )}
                </div>
            )}
        </section>
    );
}

export default ProductList;