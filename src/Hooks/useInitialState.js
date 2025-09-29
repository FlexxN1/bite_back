import { useState, useEffect } from "react";

const useInitialState = () => {
    const [state, setState] = useState({
        cart: [],
    });

    const [user, setUser] = useState(null);

    // Revisar si ya había sesión guardada
    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("userData");

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            setUser(null); // 👈 sin sesión
        }
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
    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userData", JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem("token");
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
    };
};

export default useInitialState;