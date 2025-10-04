import React, { useState } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { API_URL, Paypal } from "../../config";
import "../../style/Paypal.scss";

const PayPalButton = ({ total, formData, cart, user, onPagoCompletado }) => {
    const clientId = Paypal;
    const [compraId, setCompraId] = useState(null);

    const crearCompraPendiente = async () => {
        try {
            const order = {
                usuario_id: user?.id || 1,
                total,
                ciudad: formData.ciudad,
                direccion: formData.direccion,
                telefono: formData.telefono,
                estado_pago: "pendiente",
                estado_envio: "Pendiente",
                metodo_pago: "paypal",
                productos: cart.map(item => ({
                    id: item.id || item.id_producto,
                    cantidad: item.cantidad || 1,
                    precio: item.precio,
                })),
            };

            const res = await fetch(`${API_URL}/compras`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(order),
            });

            if (!res.ok) throw new Error("Error al registrar compra pendiente");
            const data = await res.json();
            console.log("🟢 Compra pendiente creada:", data);
            setCompraId(data.compra_id);

            return data.compra_id;
        } catch (err) {
            console.error("❌ Error creando compra pendiente:", err);
            throw err;
        }
    };

    const handleApprove = async (orderData) => {
        console.log("✅ Pago completado en PayPal:", orderData);

        let idCompra = compraId;
        if (!idCompra) {
            console.warn("⚠️ No había compraId, creando nuevo...");
            idCompra = await crearCompraPendiente();
        }

        try {
            const res = await fetch(`${API_URL}/compras/${idCompra}/estado-pago`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify({ estado_pago: "pagado" }),
            });

            if (!res.ok) throw new Error("Error al actualizar estado de pago");
            const data = await res.json();
            console.log("🟢 Estado de pago actualizado:", data);

            if (onPagoCompletado) {
                onPagoCompletado("paypal");
            }
        } catch (err) {
            console.error("❌ Error al guardar compra:", err);
        }
    };

    return (
        <div className="paypal-payment">
            <div className="paypal-container">
                <PayPalScriptProvider
                    options={{
                        "client-id": clientId,
                        currency: "USD",
                    }}
                >
                    <PayPalButtons
                        style={{
                            layout: "vertical",
                            color: "gold",
                            shape: "rect",
                            label: "paypal",
                        }}
                        createOrder={async (data, actions) => {
                            const id = await crearCompraPendiente();
                            const usdAmount = Number((Number(total) / 4000).toFixed(2));
                            console.log("💵 Monto USD enviado a PayPal:", usdAmount);

                            if (!usdAmount || usdAmount <= 0 || isNaN(usdAmount)) {
                                throw new Error("Monto inválido para PayPal: " + usdAmount);
                            }

                            return actions.order.create({
                                purchase_units: [
                                    {
                                        description: "Compra en BiteBack",
                                        amount: {
                                            currency_code: "USD",
                                            value: usdAmount.toString(),
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={async (data, actions) => {
                            const order = await actions.order.capture();
                            await handleApprove(order);
                        }}
                        onError={(err) => console.error("❌ Error en PayPal:", err)}
                    />
                </PayPalScriptProvider>
            </div>

            <p className="paypal-info">
                Pagos seguros a través de PayPal (sandbox en modo pruebas).
            </p>
        </div>
    );
};

export default PayPalButton;
