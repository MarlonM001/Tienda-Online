import api from "./client";

export const getProducts = (params) => api.get("/products", { params }).then((r) => r.data);
export const getProduct = (id) => api.get(`/products/${id}`).then((r) => r.data);

export const adminGetProducts = () => api.get("/admin/products").then((r) => r.data);
export const adminCreateProduct = (formData) =>
  api.post("/admin/products", formData).then((r) => r.data);
export const adminUpdateProduct = (id, formData) =>
  api.put(`/admin/products/${id}`, formData).then((r) => r.data);
export const adminDeleteProduct = (id) => api.delete(`/admin/products/${id}`);
