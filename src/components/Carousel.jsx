import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Flickity from "flickity";
import "../style/Header.scss";
import "flickity/css/flickity.css";

import errorImg from "../assets/errorImg.jpg"; // 👈 tu imagen fallback

export default function Carousel() {
    const carouselRef = useRef(null);
    const navigate = useNavigate();
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await fetch("https://backend-api-production-ece4.up.railway.app/productos/ultimos"); // ⚠️ ajusta al puerto real
                const data = await res.json();

                // ✅ primera imagen de cada producto o fallback
                const imgs = data.map(p => p.imagen ? p.imagen : errorImg);
                setImages(imgs);
            } catch (err) {
                console.error("Error al traer últimas imágenes", err);
                setImages([errorImg]); // fallback si falla todo
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (images.length === 0) return;

        const flkty = new Flickity(carouselRef.current, {
            wrapAround: true,
            autoPlay: 2000,
            pauseAutoPlayOnHover: false,
            prevNextButtons: false,
            pageDots: true,
            draggable: true,
        });

        return () => flkty.destroy();
    }, [images]);

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
