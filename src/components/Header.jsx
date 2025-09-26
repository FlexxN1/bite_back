import React from "react";
import Carousel from "./Carousel";
import "../style/Header.scss";

export default function Header() {
    return (
        <>
            <section className="section__main">
                <div className="section__main--info">
                    <h1>Aguacates frescos directo del agricultor</h1>
                    <p>
                        En <strong>BiteBack</strong> apoyamos a los agricultores locales
                        ofreciendo aguacates de alta calidad y productos agrícolas de
                        confianza.
                    </p>
                    <a href="/products" className="btn">Ver productos</a>
                </div>
            </section>

            <section className="carousel-section">
                <h2 className="carousel-title">Novedades de nuestros agricultores</h2>
                <Carousel />
            </section>
            <section className="about__section">
                <div className="about__content">
                    <h2>🌱 Agricultura sostenible</h2>
                    <p>
                        Trabajamos junto a comunidades rurales para promover la
                        agricultura sostenible. Cada aguacate que compras apoya a
                        agricultores locales, fomenta el comercio justo y contribuye
                        a un futuro más verde.
                    </p>
                    <p>
                        Nuestro compromiso es ofrecerte productos frescos, saludables
                        y cultivados con responsabilidad social y ambiental.
                    </p>
                </div>
            </section>
        </>
    );
}
