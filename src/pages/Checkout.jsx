import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "@context/AppContext";
import "../style/checkout.scss";
import { API_URL } from "../config";

const Checkout = () => {
    const { state, user } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: user?.nombre || "",
        direccion: "",
        ciudad: "",
        telefono: "",
        metodoPago: "tarjeta",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const sumTotal = () => {
        return state.cart.reduce((acc, item) => acc + Number(item.precio || 0), 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (state.cart.length === 0) {
            alert("⚠️ No puedes realizar una compra sin productos en el carrito.");
            return;
        }

        // 🔑 Definir estado_pago según el método de pago
        let estadoPagoInicial = "pendiente";

        if (formData.metodoPago === "contraentrega") {
            estadoPagoInicial = "pendiente"; // admin lo marca después
        } else {
            estadoPagoInicial = "pagado"; // simulamos confirmación inmediata
        }

        const order = {
            usuario_id: user?.id || 1,
            total: sumTotal(),
            ciudad: formData.ciudad,
            direccion: formData.direccion,
            telefono: formData.telefono,
            estado_pago: estadoPagoInicial, // 👈 ahora se guarda en estado_pago
            estado_envio: "Pendiente", // 👈 siempre inicia en Pendiente
            metodoPago: formData.metodoPago,
            productos: state.cart,
        };

        try {
            const res = await fetch(`${API_URL}/compras`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(order),
            });

            if (!res.ok) throw new Error("Error en la compra");

            const data = await res.json();
            console.log("Compra registrada:", data);

            alert(`✅ Compra realizada con éxito!\nTotal: ${sumTotal().toLocaleString("es-CO", {
                style: "currency",
                currency: "COP",
            })}`);

            navigate("/perfil");
        } catch (error) {
            console.error("Error en checkout:", error);
            alert("❌ Hubo un problema con la compra.");
        }
    };

    return (
        <section className="checkout-page">
            <h1>Finalizar Compra</h1>

            {/* Resumen de productos */}
            <div className="checkout-summary">
                <h2>Resumen de la compra</h2>
                {state.cart.length === 0 ? (
                    <p>No hay productos en tu carrito.</p>
                ) : (
                    <>
                        {state.cart.map((item) => (
                            <div key={item.id} className="checkout-item">
                                <span>{item.nombre}</span>
                                <span>
                                    {Number(item.precio).toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP",
                                    })}
                                </span>
                            </div>
                        ))}
                        <p className="checkout-total">
                            <strong>
                                Total:{" "}
                                {sumTotal().toLocaleString("es-CO", {
                                    style: "currency",
                                    currency: "COP",
                                })}
                            </strong>
                        </p>
                    </>
                )}
            </div>

            {/* Formulario */}
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
                    Ciudad:
                    <input
                        type="text"
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        required
                    />
                </label>

                <label>
                    Teléfono:
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
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
                        <option value="tarjeta">Tarjeta de crédito</option>
                        <option value="debito">Tarjeta débito</option>
                        <option value="contraentrega">Pago contra entrega</option>
                        <option value="nequi">Nequi / Daviplata</option>
                    </select>
                </label>

                {/* 👇 Botón bloqueado si no hay productos */}
                <button
                    type="submit"
                    className="btn-primary"
                    disabled={state.cart.length === 0}
                >
                    Confirmar Compra
                </button>
                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => navigate(-1)}
                >
                    Volver atrás
                </button>
            </form>
        </section>
    );
};

export default Checkout;
