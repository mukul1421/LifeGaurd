import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* ⭐ AUTO ATTACH TOKEN */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lg_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;

