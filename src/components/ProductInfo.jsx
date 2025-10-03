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

                <p className="admin">
                    Publicado por: <strong>{product.vendedor || "Administrador"}</strong>
                </p>
            </div>
        </>
    );
};

export default ProductInfo;
