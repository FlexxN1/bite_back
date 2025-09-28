import React, { useState, useEffect, useRef } from 'react';
import ProductItem from '@components/ProductItem';
import ProductDetail from '@components/ProductDetail';
import SkeletonProduct from '@components/SkeletonProduct';
import useGetProducts from '../Hooks/useGetProducts';
import Loader from '@components/Loader';
import '../style/ProductList.scss';
import "../style/Header.scss";


const ProductList = () => {
    const { products, loading } = useGetProducts();

    const [visibleProducts, setVisibleProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showSkeleton, setShowSkeleton] = useState(true);

    const loaderRef = useRef(null);

    // Skeleton inicial
    useEffect(() => {
        const timer = setTimeout(() => setShowSkeleton(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    // Mostrar de a 8
    useEffect(() => {
        if (products.length > 0) {
            setVisibleProducts(products.slice(0, 8));
        }
    }, [products]);

    // Observer scroll infinito
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

        setTimeout(() => {
            const nextPage = page + 1;
            const newProducts = products.slice(0, Math.min(products.length, nextPage * 8));
            setVisibleProducts(newProducts);
            setPage(nextPage);
            setLoadingMore(false);
        }, 2000);
    };

    return (
        <section className="main-container">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="ProductList">
                        {showSkeleton
                            ? Array.from({ length: 8 }).map((_, i) => (
                                <div key={`sk-init-${i}`} className="fade-in">
                                    <SkeletonProduct />
                                </div>
                            ))
                            : visibleProducts.map((product, index) => (
                                <div key={`${product.id}-${index}`} className="fade-in">
                                    <ProductItem
                                        product={product}
                                        isOpen={selectedProduct?.id === product.id}
                                        openProduct={() => setSelectedProduct(product)}
                                        closeProduct={() => setSelectedProduct(null)}
                                    />
                                </div>
                            ))}

                        {loadingMore &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={`sk-load-${i}`} className="fade-in">
                                    <SkeletonProduct />
                                </div>
                            ))}
                    </div>

                    {/* loader de scroll infinito */}
                        <div ref={loaderRef} className="infinite-loader">
                            {loadingMore ? (
                                <p className="loading-text">Cargando más productos...</p>
                            ) : visibleProducts.length < products.length ? (
                                <p className="scroll-hint">Desliza para cargar más productos</p>
                            ) : (
                                <p className="no-more">No hay más productos</p>
                            )}
                        </div>
                    {selectedProduct && (
                        <ProductDetail
                            product={selectedProduct}
                            setToggleProduct={() => setSelectedProduct(null)}
                            handleClick={() => { }}
                            isAdded={false}
                        />
                    )}
                </>
            )}
        </section>
    );
};

export default ProductList;
