import api from "./client";

export const registerCustomer = (data) => api.post("/auth/register", data).then((r) => r.data);
export const loginCustomer = (email, password) =>
  api.post("/auth/login", { email, password }).then((r) => r.data);
export const getMe = () => api.get("/auth/me").then((r) => r.data);
export const updateMe = (data) => api.put("/auth/me", data).then((r) => r.data);
