import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "@context/AppContext";
import { toast } from "../utils/toast";
import "../style/checkout.scss";
import { API_URL } from "../config";
import PayPalButton from "../components/payments/PaypalButton";

const Checkout = () => {
    const { state, user } = useContext(AppContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: user?.nombre || "",
        direccion: "",
        ciudad: "",
        telefono: "",
        metodo_pago: "tarjeta",
    });

    const [loading, setLoading] = useState(false);
    const [pagoCompleto, setPagoCompleto] = useState(false);
    const [metodoConfirmado, setMetodoConfirmado] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const sumTotal = () => {
        return state.cart.reduce(
            (acc, item) => acc + Number(item.precio || 0) * Number(item.cantidad || 1),
            0
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (state.cart.length === 0) {
            toast.fire({
                icon: "warning",
                title: "⚠️ No puedes realizar una compra sin productos en el carrito.",
            });
            return;
        }

        // ✅ PayPal requiere confirmación del pago primero
        if (formData.metodo_pago === "paypal" && !pagoCompleto) {
            toast.fire({
                icon: "info",
                title: "💳 Debes completar el pago con PayPal antes de confirmar.",
            });
            return;
        }

        // ✅ PayPal ya pagado: solo redirige
        if (formData.metodo_pago === "paypal" && pagoCompleto) {
            toast.fire({
                icon: "success",
                title: "✅ Compra confirmada. Redirigiendo al perfil...",
            });
            navigate("/perfil");
            return;
        }

        // 🔹 Otros métodos (tarjeta, nequi, bancolombia → pagado / contraentrega → pendiente)
        setLoading(true);

        const order = {
            usuario_id: user?.id || 1,
            total: sumTotal(),
            ciudad: formData.ciudad,
            direccion: formData.direccion,
            telefono: formData.telefono,
            estado_pago:
                formData.metodo_pago === "contraentrega" ? "pendiente" : "pagado",
            estado_envio: "Pendiente",
            metodo_pago: metodoConfirmado || formData.metodo_pago,
            productos: state.cart,
        };

        try {
            const res = await fetch(`${API_URL}/compras`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(order),
            });

            if (!res.ok) throw new Error("Error al registrar compra");
            await res.json();

            toast.fire({
                icon: "success",
                title: `✅ Compra registrada con ${formData.metodo_pago}`,
            });

            navigate("/perfil");
        } catch (error) {
            console.error("Error en checkout:", error);
            toast.fire({
                icon: "error",
                title: "❌ Hubo un problema al procesar tu compra.",
            });
        } finally {
            setLoading(false);
        }
    };



    return (
        <section className="checkout-page">
            <h1>Finalizar Compra</h1>

            <div className="checkout-summary">
                <h2>Resumen de la compra</h2>
                {state.cart.length === 0 ? (
                    <p>No hay productos en tu carrito.</p>
                ) : (
                    <>
                        {state.cart.map((item) => (
                            <div key={item.id} className="checkout-item">
                                <span>
                                    {item.nombre} <strong>x {item.cantidad || 1}</strong>
                                </span>
                                <span>
                                    {(
                                        Number(item.precio) * Number(item.cantidad || 1)
                                    ).toLocaleString("es-CO", {
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
                        name="metodo_pago"
                        value={formData.metodo_pago}
                        onChange={handleChange}
                    >
                        <option value="tarjeta">Tarjeta de crédito</option>
                        <option value="paypal">PayPal</option>
                        <option value="nequi">Nequi / Daviplata</option>
                        <option value="bancolombia">Bancolombia Transferencia</option>
                        <option value="contraentrega">Pago contra entrega</option>
                    </select>
                </label>

                {formData.metodo_pago === "paypal" && (
                    <div className="payment-method-section">
                        <PayPalButton
                            total={sumTotal()}
                            formData={formData}
                            cart={state.cart}
                            user={user}
                            onPagoCompletado={(metodo) => {
                                setPagoCompleto(true);
                                setMetodoConfirmado(metodo);
                                toast.fire({
                                    icon: "success",
                                    title: `✅ Pago completado con ${metodo}. Ahora confirma la compra.`,
                                });
                            }}
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="btn-primary"
                    disabled={
                        state.cart.length === 0 ||
                        loading ||
                        (formData.metodo_pago === "paypal" && !pagoCompleto)
                    }
                >
                    {loading ? "Procesando..." : "Confirmar Compra"}
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
