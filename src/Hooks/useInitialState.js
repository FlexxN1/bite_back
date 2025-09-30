import { useState, useEffect } from "react";

const useInitialState = () => {
    const [state, setState] = useState({
        cart: [],
    });

    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true); // 👈 nuevo

    // Revisar si ya había sesión guardada
    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        const savedUser = localStorage.getItem("userData");

        if (accessToken && refreshToken && savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            setUser(null); // 👈 sin sesión
        }

        const timer = setTimeout(() => setLoadingUser(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // funciones de carrito
    const addToCart = (payload) => {
        setState((prev) => ({
            ...prev,
            cart: [...prev.cart, payload],
        }));
    };

    const removeFromCart = (payload) => {
        setState((prev) => ({
            ...prev,
            cart: prev.cart.filter((item) => item.id !== payload.id),
        }));
    };

    // funciones de sesión
    const login = ({ user, accessToken, refreshToken }) => {
        if (accessToken) {
            localStorage.setItem("accessToken", accessToken);
        }
        if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken);
        }
        localStorage.setItem("userData", JSON.stringify(user));
        setUser(user);
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userData");
        setUser(null);
        setState({ cart: [] }); // vaciar carrito
    };

    return {
        state,
        addToCart,
        removeFromCart,
        user,
        login,
        logout,
        loadingUser, // 👈 lo devolvemos
    };
};

export default useInitialState;
