import React, { useContext } from 'react';
import '../style/OrderItem.scss';
import iconClose from '../assets/icon_close.png';
import img_url from '../assets/errorImg.jpg';
import AppContext from '@context/AppContext';

const OrderItem = ({ product }) => {
    const { removeFromCart, updateCart } = useContext(AppContext);

    const handleCantidadChange = (e) => {
        const nuevaCantidad = Number(e.target.value);
        if (nuevaCantidad > 0) {
            updateCart({ ...product, cantidad: nuevaCantidad });
        }
    };

    return (
        <div className="OrderItem">
            <figure>
                <img src={product.imagen_url || img_url} alt={product.nombre} />
            </figure>

            <div className="order-info">
                <p>{product.nombre}</p>
                <p>
                    {Number(product.precio).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                    })} x {product.cantidad}
                </p>
                <strong>
                    {(Number(product.precio) * (product.cantidad || 1)).toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                    })}
                </strong>
            </div>

            <input
                type="number"
                min="1"
                max={product.stock}
                value={product.cantidad}
                onChange={handleCantidadChange}
                className="input-cantidad-order"
            />

            <img
                className="imgClose"
                src={iconClose}
                alt="close"
                onClick={() => removeFromCart(product)}
            />
        </div>
    );
};

export default OrderItem;
