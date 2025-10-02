import React, { useContext, useState } from 'react';
import '../style/ProductItem.scss';
import AppContext from '@context/AppContext';
import addToCartImage from '../assets/bt_add_to_cart.svg';
import addedToCartImage from '../assets/bt_added_to_cart.svg';
import img from "../assets/errorImg.jpg";
import imgAgotado from "../assets/pngwing.com.png"
import imgError from "../assets/errorImg.jpg";

const ProductItem = ({ product, isOpen, openProduct, closeProduct }) => {
    const { state, addToCart } = useContext(AppContext);
    const [cantidad, setCantidad] = useState("");

    const handleClick = (item) => {
        if (!state.cart?.some(p => p.id === item.id) && cantidad > 0) {
            addToCart({ ...item, cantidad });
        }
    };

    const verifyAdded = (item) => {
        return state.cart?.some(p => p.id === item.id)
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
                {product.stock === 0 && (
                    <div className="overlay-agotado">
                        <img src={imgAgotado} alt="Agotado" className="overlay-icon" />
                    </div>
                )}
            </div>

            <div className="product-info">
                <div>
                    <p>${product.precio}</p>
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
                        <img src={verifyAdded(product)} alt={product.nombre} />
                    </figure>
                )}
            </div>
        </div>
    );
};

export default ProductItem;
