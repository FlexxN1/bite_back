import React, { useContext, useState } from 'react';
import '../style/ProductInfo.scss';
import AppContext from '@context/AppContext';
import imgError from "../assets/errorImg.jpg";
import btnLeft from "../assets/icons-atras.png";
import btnRight from "../assets/icons-adelante.png";

const ProductInfo = ({ product }) => {
    const { user } = useContext(AppContext);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        if (product.imagenes_producto && product.imagenes_producto.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % product.imagenes_producto.length);
        }
    };

    const prevImage = () => {
        if (product.imagenes_producto && product.imagenes_producto.length > 0) {
            setCurrentIndex((prev) =>
                prev === 0 ? product.imagenes_producto.length - 1 : prev - 1
            );
        }
    };

    return (
        <>
            <div className="carousel-wrapper__info">
                {product.imagenes_producto && product.imagenes_producto ? (
                    <>
                        <img
                            src={product.imagenes_producto[currentIndex]}
                            alt={product.nombre}
                            className="carousel-image__info"
                            onError={(e) => { e.target.src = imgError; }}
                        />
                        {product.imagenes_producto.length > 1 && (
                            <>
                                <button onClick={prevImage} className="carousel-btn-info__right">
                                    <img src={btnLeft} alt="Anterior" />
                                </button>
                                <button onClick={nextImage} className="carousel-btn-info__left">
                                    <img src={btnRight} alt="Siguiente" />
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <img
                        src={imgError}
                        alt="Sin imagen"
                        className="carousel-image-error__info"
                    />
                )}
            </div>
                <div className="ProductInfo">
                <p className="price">{Number(product.precio).toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                })}</p>
                    <p className="name">{product.nombre}</p>
                    <p className="description">{product.descripcion}</p>
                    <p className="stock">Disponibles: {product.stock}</p>

                    <p className="admin">
                        Publicado por: <strong>{product.vendedor || "Administrador"}</strong>
                    </p>
                </div>
        </>

    );
};

export default ProductInfo;
