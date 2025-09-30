import React, { useContext } from 'react';
import '../style/ProductInfo.scss';
import addToCartIcon from '../assets/bt_add_to_cart.svg';
import AppContext from '@context/AppContext';
import img from "../assets/img.png";

const ProductInfo = ({ product, setToggleProduct, setToggleOrders, isAdded }) => {
    const { state, addToCart } = useContext(AppContext);

    // Verifica si el producto ya está en el carrito
    const isInCart = state.cart.some(item => item.id === product.id);

    const handleAddToCart = () => {
        if (!isInCart) {
            addToCart(product); // lo agrega si no está
        }
        //setToggleProduct(false);  // cierra modal de producto
        setToggleOrders(false);   // asegura que también se cierre MyOrder
    };

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

                {/* 👇 Nombre administrador hardcodeado */}
                <p className="admin">Publicado por: <strong>Juan Pérez</strong></p>

                <button
                    className={`primary-button add-to-cart-button ${isInCart ? "in-cart" : ""}`}
                    onClick={handleAddToCart}
                    disabled={isInCart} // desactiva si ya está
                >
                    <img src={addToCartIcon} alt="add to cart" />
                    {isAdded ? "Agregado al carrito" : "Agregar al carrito"}
                </button>
            </div>
        </>
    );
};

export default ProductInfo;
