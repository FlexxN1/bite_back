import React, { useContext, useState } from 'react';
import '../style/ProductItem.scss';
import AppContext from '@context/AppContext';
import addToCartImage from '../assets/bt_add_to_cart.svg';
import addedToCartImage from '../assets/bt_added_to_cart.svg';
import img from "../assets/errorImg.jpg";
import imgError from "../assets/errorImg.jpg";

const ProductItem = ({ product, isOpen, openProduct, closeProduct }) => {
    const { state, addToCart, updateCart } = useContext(AppContext);
    const [cantidad, setCantidad] = useState("");

    const productoEnCarrito = state.cart.find(p => p.id === product.id);

    const handleClick = (item) => {
        if (!productoEnCarrito && cantidad > 0) {
            // 🚀 Si no está en el carrito, lo agrega
            addToCart({ ...item, cantidad: Number(cantidad) });
        } else if (productoEnCarrito && cantidad > 0) {
            // 🚀 Si ya está, solo actualiza la cantidad
            updateCart({ ...productoEnCarrito, cantidad: Number(cantidad) });
        }
    };

    const verifyAdded = () => {
        if (!productoEnCarrito) return addToCartImage;
        return productoEnCarrito.cantidad === Number(cantidad)
            ? addedToCartImage
            : addToCartImage;
    };

    return (
        <div className="ProductItem">
            <div className="image-wrapper">
                <img
                    src={product.imagen_url || img}
                    loading="lazy"
                    alt={product.descripcion}
                    className={`productImage ${product.stock === 0 ? "agotado-img" : ""}`}
                    onClick={() => (isOpen ? closeProduct() : openProduct())}
                    onError={(e) => { e.target.src = imgError; }}
                />
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
