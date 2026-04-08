import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Injecter le token Sanctum automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("boc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gérer les erreurs globales (401 → déconnexion)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("boc_token");
      window.location.href = "/";
    }
    return Promise.reject(err);
  }
);

export default api;