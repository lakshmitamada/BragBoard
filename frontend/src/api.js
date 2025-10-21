// src/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const api = axios.create({
  baseURL: API_URL,
});
<<<<<<< HEAD

// attach auth header from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
=======
>>>>>>> 44a975c9b459787b377eaa0374e29e58f29a4d1f
