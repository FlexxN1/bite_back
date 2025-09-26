import React, { useContext } from 'react';
import '../style/ProductItem.scss';
import AppContext from '@context/AppContext';
import ProductDetail from '@components/ProductDetail';
import addToCartImage from '../assets/bt_add_to_cart.svg';
import addedToCartImage from '../assets/bt_added_to_cart.svg';
import img from "../assets/img.png";

const ProductItem = ({ product, isOpen, openProduct, closeProduct }) => {
    const { state, addToCart } = useContext(AppContext);

    const handleClick = (item) => {
        if (!state.cart.includes(item)) {
            addToCart(item);
        }
    };

    const verifyAdded = (item) => {
        return state.cart.includes(item) ? addedToCartImage : addToCartImage;
    };

    return (
        <div className="ProductItem">
            <img
                src={product.imagen_urll || img}
                loading="lazy"
                alt={product.descripcion}
                className="productImage"
                onClick={() => isOpen ? closeProduct() : openProduct()}
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
            {isOpen && (
                <ProductDetail
                    product={product}
                    setToggleProduct={closeProduct}
                    handleClick={handleClick}
                    isAdded={state.cart.includes(product)}
                />
            )}
        </div>
    );
};

export default ProductItem;
