import React, {useState, useContext}from "react"
import { Link } from "react-router-dom"
import logo from "@assets/logo.png"
import "../style/navbar.scss"
import "../style/shoppingCartItem.scss"
import AppContext from "@context/AppContext"
import MyOrder from './MyOrder';
import logoShopping from "@assets/icon_shopping_cart.svg"

export default function Navbar (){
    const [toggleOrders, setToggleOrders] = useState(false)

    const { state: { cart } } = useContext(AppContext);

    const verifyCart = (cartNumber) => {
        if ((cartNumber) && (cartNumber > 9)) {
            return "+9";
        } else {
            return cartNumber;
        }
    }

    return (
        <>
            <header className="header">
                <div className="container__header">
                    <div className="container__items--header">
                        <img src={logo} alt="BiteBack Logo" />
                        <h1>BiteBack</h1>
                    </div>
               
                <nav>
                    <Link to="/">Inicio</Link>
                    <Link to="/products">Productos</Link>
                    <a href="/">Contacto</a>
                    <Link to="/login" >Iniciar sesión</Link>
                    <Link to="/registro" >Registrarse</Link>
                    <Link to="/perfil" >Mi perfil</Link>
                        <span className="navbar-shopping-cart" onClick={() => setToggleOrders(!toggleOrders)}>
                            {/*{cart.length > 0 ? <div>{cart.length > 9 ? '+9' : cart.length }</div> : null } */}
                            <img src={logoShopping} alt="shopping cart" />
                            {cart.length > 0 && <div>{verifyCart(cart.length)}</div>}
                    </span>
                </nav>
                </div>
                {toggleOrders && <MyOrder toggleOrders={toggleOrders} setToggleOrders={setToggleOrders} />}
            </header>
        </>
    )
}