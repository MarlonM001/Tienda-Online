import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_ORIGIN}/api`,
});

api.interceptors.request.use((config) => {
  const isAdminRoute = config.url?.startsWith("/admin");
  const token = localStorage.getItem(isAdminRoute ? "admin_token" : "customer_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (location.pathname.startsWith("/admin")) {
        localStorage.removeItem("admin_token");
        if (location.pathname !== "/admin/login") {
          location.href = "/admin/login";
        }
      } else {
        localStorage.removeItem("customer_token");
        localStorage.removeItem("customer_user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
