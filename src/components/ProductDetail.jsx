import React from 'react';
import ProductInfo from '@components/ProductInfo';
import '../style/ProductDetail.scss';
import iconClose from '../assets/icon_close.png';

const ProductDetail = ({ product, setToggleProduct, handleClick }) => {
    return (
        <aside className="ProductDetail">
            <div className="ProductDetail-close" onClick={() => setToggleProduct(false)}>
                <img src={iconClose} alt="close" />
            </div>
            <ProductInfo
                product={product}
                setToggleProduct={setToggleProduct}
                handleClick={handleClick}
            />
        </aside>
    );
}

export default ProductDetail;