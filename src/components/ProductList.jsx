// src/pages/ProductList.jsx
import React, { useState, useEffect, useRef } from 'react';
import ProductItem from '@components/ProductItem';
import SkeletonProduct from '@components/SkeletonProduct'; // 👈 skeleton
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
            "vendedor_id": 1,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        },
        {
            "id": 2,
            "nombre": "Aguacate Criollo",
            "descripcion": "Pequeño pero muy sabroso",
            "precio": "3500.00",
            "imagen_url": "https://example.com/imagenes/aguacate_criollo.jpg",
            "stock": 80,
            "vendedor_id": 2,
            "fecha_creacion": "2025-09-25T01:56:41.000Z"
        }
    ]
};

// Generamos hasta id: 60
for (let i = 3; i <= 60; i++) {
    productos.productos.push({
        id: i,
        nombre: `Aguacate Especial ${i}`,
        descripcion: `Variedad especial número ${i}, de excelente calidad`,
        precio: `${3000 + (i * 10)}.00`,
        imagen_url: `https://example.com/imagenes/aguacate_${i}.jpg`,
        stock: 50 + (i % 20),
        vendedor_id: i,
        fecha_creacion: "2025-09-25T01:56:41.000Z"
    });
}

const ProductList = () => {
    const { products, loading } = useGetProducts(productos);

    const [visibleProducts, setVisibleProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSkeleton, setShowSkeleton] = useState(true);

    const loaderRef = useRef(null);

    // Skeleton inicial (2s)
    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Mostrar los primeros productos
    useEffect(() => {
        if (products.length > 0) {
            setVisibleProducts(products.slice(0, 8));
        }
    }, [products]);

    // Observer para infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingMore && visibleProducts.length < products.length) {
                    loadMore();
                }
            },
            { threshold: 0.9 }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [loadingMore, visibleProducts, products]);

    const loadMore = () => {
        if (visibleProducts.length >= products.length) return;
        setLoadingMore(true);

        // ⏳ simular skeleton durante 2s antes de mostrar los nuevos
        setTimeout(() => {
            const nextPage = page + 1;
            const newProducts = products.slice(0, Math.min(products.length, nextPage * 8));
            setVisibleProducts(newProducts);
            setPage(nextPage);
            setLoadingMore(false);
        }, 2000);
    };

    const openProduct = (product) => setSelectedProduct(product);
    const closeProduct = () => setSelectedProduct(null);

    return (
        <section className="main-container">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="ProductList">
                        {/* skeleton inicial */}
                        {showSkeleton ? (
                            Array.from({ length: 8 }).map((_, i) => (
                                <div key={`sk-init-${i}`} className="fade-in">
                                    <SkeletonProduct />
                                </div>
                            ))
                        ) : (
                            visibleProducts.map((product, index) => (
                                <div key={`${product.id}-${index}`} className="fade-in">
                                    <ProductItem
                                        product={product}
                                        isOpen={selectedProduct?.id === product.id}
                                        openProduct={() => openProduct(product)}
                                        closeProduct={closeProduct}
                                    />
                                </div>
                            ))
                        )}

                        {/* skeleton mientras carga más productos en scroll */}
                        {loadingMore &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={`sk-load-${i}`} className="fade-in">
                                    <SkeletonProduct />
                                </div>
                            ))}
                    </div>

                    {/* loader de scroll infinito abajo */}
                    <div ref={loaderRef} className="infinite-loader">
                        {loadingMore ? (
                            <p className="loading-text">Cargando más productos...</p>
                        ) : visibleProducts.length < products.length ? (
                            <p className="scroll-hint">Desliza para cargar más productos</p>
                        ) : (
                            <p className="no-more">No hay más productos</p>
                        )}
                    </div>
                </>
            )}
        </section>
    );
};

export default ProductList;
