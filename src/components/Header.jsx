import React from "react";

import { Link } from "react-router-dom";

import logo from "@assets/logo.png"
import logo1 from "@assets/img.png"

export default function Header() {
    return (
        <>
            <header className="header">
                <div className="container__header">
                <div className="container__items--header">
                    <img src={logo} alt="BiteBack Logo"/>
                    <h1>BiteBack</h1>
                </div>
                <nav>
                    <a href="#inicio">Inicio</a>
                    <Link to="/products">Productos</Link>
                    <a href="/">Contacto</a>
                    <Link to="/login" >Iniciar sesión</Link>
                    <Link to="/registro" >Registrarse</Link>
                    <Link to="/perfil" >Mi perfil</Link>

                </nav>
                </div>
            </header>

            <section className="section__main">
                <div className="section__main--info">
                <h1>Tu seguridad es nuestra prioridad</h1>
                <p>Protege tus datos con nuestra tecnología avanzada.</p>
                <a href="#productos" className="btn">Conoce más</a>
                </div>
            </section>

            <section className="container__info">
                <h3 className="text-center">Nuestros productos</h3>
                <div>
                <div>
                    <div className="card_shadow">
                        <img src={logo1} className="logo-container" alt="Nuestros productos"/>
                    <div>
                        <h5 className="text-center">Firewall Inteligente</h5>
                        <p>Reduce el desperdicio de alimentos y compra productos cercanos a vencer.</p>
                        <a href="#" className="btn btn-outline-light">Comprar ahora</a>
                    </div>
                    </div>
                </div>
                </div>
            </section>

            <section className="contacto">
                <div className="container">
                    <h3 className="text-center mb-4">Contáctanos</h3>
                    <form actions="/">
                        <div className="mb-3">
                            <label htmlFor="nombre" className="htmlForm-label text-light">Nombre:</label>
                            <input type="text" className="htmlForm-control" placeholder="pepito"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="htmlForm-label text-light">Correo:</label>
                            <input type="email" className="htmlForm-control" placeholder="example@gamil.com"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="mensaje" className="htmlForm-label text-light">Mensaje:</label>
                            <textarea className="htmlForm-control"></textarea>
                        </div>
                        <button type="submit" className="btn btn-outline-danger">Enviar mensaje</button>
                    </form>
                </div>
            </section>
        </>
    )
};