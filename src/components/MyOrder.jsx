import { Link, useNavigate } from "react-router-dom";
import React, { useContext } from 'react';
import OrderItem from './OrderItem';
import '../style/MyOrder.scss';
import { toast } from "../utils/toast.js"
import iconArrow from '@assets/flechita.svg';
import AppContext from '@context/AppContext';

const MyOrder = ({ toggleOrders, setToggleOrders }) => {
    const { state, user } = useContext(AppContext);
    const navigate = useNavigate();


    const sumTotal = () => {
        return state.cart.reduce((acc, product) => {
            return acc + Number(product.precio || 0);
        }, 0);
    };

    const handleCheckout = () => {
        if (!user) {
            toast.fire({ icon: "error", title: "⚠️ Debes iniciar sesión o registrarte para poder comprar." })
            navigate("/login");
            return;
        }
        navigate("/checkout");
    };

    return (
        <aside className="MyOrder">
            <div
                className="title-containerOrder"
                onClick={() => setToggleOrders(!toggleOrders)}
            >
                <img src={iconArrow} alt="arrow" />
                <p className="title1">Mis compras</p>
            </div>

            <div className="my-order-content">
                {state.cart.map((product) => (
                    <OrderItem product={product} key={`orderItem-${product.id}`} />
                ))}
            </div>

            <div className="order">
                <p><span>Total</span></p>
                <p>
                    {sumTotal().toLocaleString("es-CO", {
                        style: "currency",
                        currency: "COP",
                    })}
                </p>
            </div>
            <button onClick={handleCheckout} className="primary-button">
                Comprar
            </button>
        </aside>
    );
};

export default MyOrder;