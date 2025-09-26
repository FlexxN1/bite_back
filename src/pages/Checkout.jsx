import React, { useContext, useState } from "react";
import AppContext from "@context/AppContext";
import "../style/checkout.scss";

const Checkout = () => {
    const { state } = useContext(AppContext);
    const [formData, setFormData] = useState({
        nombre: "",
        direccion: "",
        metodoPago: "tarjeta",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const order = {
            usuario_id: 1, // Aquí deberías usar el ID del usuario autenticado
            productos: state.cart,
            total: state.total,
            ...formData,
        };

        try {
            const res = await fetch("https://tu-api.com/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });

            const data = await res.json();
            alert(`Compra realizada con éxito! ID: ${data.orderId}`);
        } catch (error) {
            console.error("Error en el checkout:", error);
            alert("Hubo un problema con la compra.");
        }
    };

    return (
        <div className="checkout-page">
            <h1>Finalizar Compra</h1>
            <form className="checkout-form" onSubmit={handleSubmit}>
                <label>
                    Nombre:
                    <input
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Dirección:
                    <input
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Método de Pago:
                    <select
                        name="metodoPago"
                        value={formData.metodoPago}
                        onChange={handleChange}
                    >
                        <option value="tarjeta">Tarjeta</option>
                        <option value="paypal">PayPal</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </label>

                <button type="submit" className="primary-button">
                    Confirmar Compra
                </button>
            </form>

            <div className="checkout-summary">
                <h2>Resumen de la compra</h2>
                {state.cart.map((item) => (
                    <div key={item.id}>
                        {item.nombre} - ${item.precio}
                    </div>
                ))}
                <p><strong>Total: ${state.total}</strong></p>
            </div>
        </div>
    );
};

export default Checkout;
