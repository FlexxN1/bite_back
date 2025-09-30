import React, { useContext } from 'react';
import '../style/ProductItem.scss';
import AppContext from '@context/AppContext';
import addToCartImage from '../assets/bt_add_to_cart.svg';
import addedToCartImage from '../assets/bt_added_to_cart.svg';
import img from "../assets/errorImg.jpg";
import imgError from "../assets/errorImg.jpg";

const ProductItem = ({ product, isOpen, openProduct, closeProduct }) => {
    const { state, addToCart } = useContext(AppContext);

    const handleClick = (item) => {
        if (!state.cart?.some(p => p.id === item.id)) {
            addToCart(item);
        }
    };

    const verifyAdded = (item) => {
        return state.cart?.some(p => p.id === item.id)
            ? addedToCartImage
            : addToCartImage;
    };


    return (
        <div className="ProductItem">
            <img
                src={product.imagen_url || img}
                loading="lazy"
                alt={product.descripcion}
                className="productImage"
                onClick={() => (isOpen ? closeProduct() : openProduct())}
                onError={(e) => { e.target.src = imgError; }}
            />
            <div className="product-info">
                <div>
                    <p>${product.precio}</p>
                    <p>{product.nombre ? product.nombre.substring(0, 80) : "Sin nombre"}</p>
                </div>
                <figure onClick={() => handleClick(product)}>
                    <img src={verifyAdded(product)} alt={product.nombre} />
                </figure>
            </div>
        </div>
    );
};

export default ProductItem;
