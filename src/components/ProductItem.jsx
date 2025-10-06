import React, { useContext, useState } from 'react';
import '../style/ProductItem.scss';
import AppContext from '@context/AppContext';
import addToCartImage from '../assets/bt_add_to_cart.svg';
import addedToCartImage from '../assets/bt_added_to_cart.svg';
import btnLeft from "../assets/icons-adelante.png"
import btnRight from "../assets/icons-atras.png"
import imgError from "../assets/errorImg.jpg";

const ProductItem = ({ product, isOpen, openProduct, closeProduct }) => {
    const { state, addToCart, updateCart } = useContext(AppContext);
    const [cantidad, setCantidad] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);

    const productoEnCarrito = state.cart.find(p => p.id === product.id);

    const handleClick = (item) => {
        if (!productoEnCarrito && cantidad > 0) {
            addToCart({ ...item, cantidad: Number(cantidad) });
        } else if (productoEnCarrito && cantidad > 0) {
            updateCart({ ...productoEnCarrito, cantidad: Number(cantidad) });
        }
    };

    const verifyAdded = () => {
        if (!productoEnCarrito) return addToCartImage;
        return productoEnCarrito.cantidad === Number(cantidad)
            ? addedToCartImage
            : addToCartImage;
    };

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
        <div className="ProductItem">
            <div className="image-wrapper">
                {product.imagenes_producto && product.imagenes_producto.length > 0 ? (
                    <>
                        <img
                            src={product.imagenes_producto[currentIndex]}
                            alt={product.nombre}
                            className={`productImage ${product.stock === 0 ? "agotado-img" : ""}`}
                            onClick={() => (isOpen ? closeProduct() : openProduct())}
                            onError={(e) => { e.target.src = imgError; }}
                        />
                        {product.imagenes_producto && (
                            <>
                                <button onClick={prevImage} className="carousel-btn__right">
                                    <img src={btnRight} alt="Anterior" />
                                </button>
                                <button onClick={nextImage} className="carousel-btn__left">
                                    <img src={btnLeft} alt="Siguiente" />
                                </button>
                            </>
                        )}
                    </>
                ) : (
                    <img
                        src={imgError}
                        alt="Sin imagen"
                        className="productImage"
                    />
                )}
            </div>

            <div className="product-info">
                <div>
                    <p>
                        {Number(product.precio).toLocaleString("es-CO", {
                            style: "currency",
                            currency: "COP",
                        })}
                    </p>
                    <p>{product.nombre ? product.nombre.substring(0, 80) : "Sin nombre"}</p>
                    <p>Stock: {product.stock}</p>

                    {product.stock > 0 ? (
                        <input
                            type="number"
                            min="1"
                            max={product.stock}
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)}
                            className="input-cantidad"
                            placeholder="Cantidad"
                        />
                    ) : (
                        <p className="agotado-text">Agotado 🚫</p>
                    )}
                </div>

                {product.stock > 0 && (
                    <figure
                        className={`add-to-cart-btn ${!cantidad ? "disabled" : ""}`}
                        onClick={() => handleClick(product)}
                    >
                        <img src={verifyAdded()} alt={product.nombre} />
                    </figure>
                )}
            </div>
        </div>
    );
};

export default ProductItem;
