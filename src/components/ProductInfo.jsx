import React, { useContext, useState } from 'react';
import '../style/ProductInfo.scss';
import addToCartIcon from '../assets/bt_add_to_cart.svg';
import AppContext from '@context/AppContext';
import img from "../assets/img.png";

const ProductInfo = ({ product, setToggleProduct, setToggleOrders, isAdded }) => {
    const { state, addToCart } = useContext(AppContext);

    const [cantidad, setCantidad] = useState(0);

    // Verifica si el producto ya está en el carrito
    const isInCart = state.cart.some(item => item.id === product.id);

    const handleAddToCart = () => {
        if (!isInCart && cantidad > 0 && cantidad <= product.stock) {
            addToCart({ ...product, cantidad });
            setToggleOrders(false);
        }
    };

    const isDisabled = isInCart || cantidad <= 0 || cantidad > product.stock;

    return (
        <>
            <img
                src={product.imagen_url || img}
                alt={product.nombre}
                className="product"
            />
            <div className="ProductInfo">
                <p className="price">${product.precio}</p>
                <p className="name">{product.nombre}</p>
                <p className="description">{product.descripcion}</p>
                <p className="stock">Disponibles: {product.stock}</p>

                {/* 👇 Nombre del vendedor */}
                <p className="admin">
                    Publicado por: <strong>{product.vendedor || "Administrador"}</strong>
                </p>

                {/* Selector de cantidad */}
                <div className="quantity-selector">
                    <label>Cantidad: </label>
                    <input
                        placeholder='Cantidad'
                        className='btn-cantidad'
                        type="number"
                        min="1"
                        max={product.stock}
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                    />
                </div>

                <button
                    className={`primary-button add-to-cart-button ${isInCart ? "in-cart" : ""}`}
                    onClick={handleAddToCart}
                    disabled={isDisabled}
                >
                    {isDisabled ? (
                        isInCart ? "Agregado al carrito" : "Selecciona cantidad"
                    ) : (
                        <>
                            <img src={addToCartIcon} alt="add to cart" />
                            Agregar al carrito
                        </>
                    )}
                </button>
            </div>
        </>
    );
};

export default ProductInfo;
