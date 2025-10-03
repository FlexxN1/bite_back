import { useState, useEffect } from "react";

const useInitialState = () => {
    const [state, setState] = useState({
        cart: [],
    });

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Revisar si ya había sesión guardada
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const savedUser = localStorage.getItem("userData");

        try {
            if (accessToken && refreshToken && savedUser && savedUser !== "undefined") {
                setUser(JSON.parse(savedUser));
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("❌ Error al parsear userData:", error);
            setUser(null);
            localStorage.removeItem("userData");
        }

        const timer = setTimeout(() => setLoadingUser(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // 👉 Funciones de carrito
    const addToCart = (payload) => {
        setState((prev) => {
            const exists = prev.cart.find((item) => item.id === payload.id);
            if (exists) {
                // si existe, actualizar cantidad
                return {
                    ...prev,
                    cart: prev.cart.map((item) =>
                        item.id === payload.id
                            ? { ...item, cantidad: Number(payload.cantidad) }
                            : item
                    ),
                };
            }
            // si no existe, agregar nuevo
            return { ...prev, cart: [...prev.cart, payload] };
        });
    };

    const removeFromCart = (payload) => {
        setState((prev) => ({
            ...prev,
            cart: prev.cart.filter((item) => item.id !== payload.id),
        }));
    };

    const updateCart = (payload) => {
        setState((prev) => ({
            ...prev,
            cart: prev.cart.map((item) =>
                item.id === payload.id ? { ...item, cantidad: payload.cantidad } : item
            ),
        }));
    };

    const updateCartFromWS = (payload) => {
        // payload = [{id, cantidad, precio, ...}, {...}]
        setState((prev) => ({
            ...prev,
            cart: payload,
        }));
    };


    // Sesión
    const login = ({ user, accessToken, refreshToken }) => {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userData", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        setUser(null);
        setState({ cart: [] });
    };

    return {
        state,
        addToCart,
        removeFromCart,
        updateCart, 
        user,
        updateCartFromWS,
        login,
        logout,
        loadingUser,
    };
};

export default useInitialState;
