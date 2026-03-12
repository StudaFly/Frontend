/// <reference types="vite/client" />
import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1",
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${import.meta.env.VITE_API_URL}/auth/refresh`,
                        { refreshToken }
                    );
                    localStorage.setItem("accessToken", data.data.accessToken);
                    error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return apiClient(error.config);
                } catch {
                    localStorage.clear();
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
