import { Link } from "react-router-dom";
import React, { useContext, useState } from 'react';
import OrderItem from './OrderItem';
import '../style/MyOrder.scss';
import iconArrow from '@assets/flechita.svg';
import AppContext from '@context/AppContext';
import Checkout from '@pages/Checkout';


const MyOrder = ({ toggleOrders, setToggleOrders }) => {
    /*const sumTotal = () => {
        const reducer = (accumulator, currentValue) => accumulator + currentValue.price;
        const sum = state.cart.reduce(reducer, 0);
        return sum;
    }*/
    const { state } = useContext(AppContext);

    return (
        <aside className="MyOrder">
            <div className="title-containerOrder"
                onClick={() => setToggleOrders(!toggleOrders)}
            >
                <img src={iconArrow} alt="arrow" />
                <p className="title1">Mi orden</p>
            </div>
            <div className="my-order-content">
                {state.cart.map((product) => (
                    <OrderItem product={product} key={`orderItem-${product.id}`} />
                ))}
            </div>
            <div className="order">
                <p>
                    <span>Total</span>
                </p>
                <p>${state.total}</p>
            </div>
            <button>
                <Link to="/checkout" className="primary-button">Comprar</Link>
            </button>
        </aside>
    );
}

export default MyOrder;