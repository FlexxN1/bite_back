import React, { useContext } from 'react';
import '../style/OrderItem.scss';
import iconClose from '@assets/icon_close.png';
import AppContext from '@context/AppContext';

const OrderItem = ({ product }) => {
    const { removeFromCart } = useContext(AppContext);

    return (
        <div className="OrderItem">
            <figure>
                <img src={product.images[0]} alt={product.title} />
            </figure>
            <p>{product.title}</p>
            <p>${product.price}</p>
            <img className="imgClose"
                src={iconClose} alt="close"
                onClick={() => removeFromCart(product)}
            />
        </div>
    );
}

export default OrderItem;