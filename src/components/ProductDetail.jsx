import React, { useContext } from 'react';
import ProductInfo from '@components/ProductInfo';
import '../style/ProductDetail.scss';
import iconClose from '../assets/icon_close.png';
import AppContext from '@context/AppContext';

const ProductDetail = ({ product, setToggleProduct, handleClick }) => {
    const { user } = useContext(AppContext);

    // 🔹 wrapper: solo deja comprar si hay sesión
    const handleProtectedClick = (item) => {
        if (!user) {
            alert("⚠️ Debes iniciar sesión para poder comprar.");
            return;
        }
        handleClick(item); // 👉 aquí se ejecuta tu lógica normal de compra
    };

    return (
        <div className='container-modal'>
            <aside className="ProductDetail">
                <div
                    className="ProductDetail-close"
                    onClick={() => setToggleProduct(false)}
                >
                    <img src={iconClose} alt="close" />
                </div>

                <ProductInfo
                    product={product}
                    setToggleProduct={setToggleProduct}
                    handleClick={handleProtectedClick} // 👈 protegemos aquí
                />
            </aside>
        </div>
    );
};

export default ProductDetail;
