import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Flickity from "flickity";
import "../style/Header.scss"
import "flickity/css/flickity.css";

import img from "../assets/img.png";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";
import img5 from "../assets/img5.jpg";

const images = [img, img2, img3, img4, img5];

export default function Carousel() {
    const carouselRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const flkty = new Flickity(carouselRef.current, {
            wrapAround: true,   
            autoPlay: 2000,         
            pauseAutoPlayOnHover: false,
            prevNextButtons: false,
            pageDots: true,         
            draggable: true,
        });

        return () => flkty.destroy(); // Limpia instancia al desmontar
    }, []);

    const goToProducts = () => {
        navigate("/products");
    };

    return (
        <div className="gallery" ref={carouselRef} onClick={goToProducts}>
            {images.map((src, idx) => (
                <div
                    className="gallery-cell"
                    key={idx}
                    style={{ backgroundImage: `url(${src})` }}
                ></div>
            ))}
        </div>
    );
}
