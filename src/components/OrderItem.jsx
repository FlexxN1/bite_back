import React, { useContext } from 'react';
import '../style/OrderItem.scss';
import iconClose from '../assets/icon_close.png';
import img_url from '../assets/errorImg.jpg';
import AppContext from '@context/AppContext';

const OrderItem = ({ product }) => {
    const { removeFromCart } = useContext(AppContext);

    return (
        <div className="OrderItem">
            <figure>
                <img src={product.imageness_url || img_url} alt={product.nombre} />
            </figure>
            <p>{product.nombre}</p>
            <p>${product.precio}</p>
            <img className="imgClose"
                src={iconClose} alt="close"
                onClick={() => removeFromCart(product)}
            />
        </div>
    );
}

export default OrderItem;