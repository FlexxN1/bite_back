// src/services/apiClient.js
import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
    baseURL: API_URL,
});

// ✅ Interceptor para incluir el token en cada request
api.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// ✅ Interceptor para manejar expiración de tokens
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response.data?.error === "Token inválido" &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No hay refresh token");
                }

                const res = await axios.post(`${API_URL}/auth/refresh`, {
                    refreshToken,
                });

                const newAccessToken = res.data.accessToken;
                localStorage.setItem("accessToken", newAccessToken);

                // Reintentar petición original con el nuevo token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (err) {
                console.error("❌ Error refrescando token:", err);

                // limpiar todo y opcionalmente redirigir a login
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                // ejemplo: redirigir si estás en React Router
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;