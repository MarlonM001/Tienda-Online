import api from "./client";

export const createOrder = (order) => api.post("/orders", order).then((r) => r.data);
export const getMyOrders = () => api.get("/orders/mine").then((r) => r.data);

export const adminGetOrders = (status) =>
  api.get("/admin/orders", { params: status ? { status } : {} }).then((r) => r.data);
export const adminGetOrder = (id) => api.get(`/admin/orders/${id}`).then((r) => r.data);
export const adminUpdateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status }).then((r) => r.data);
export const adminUpdatePaymentStatus = (id, paymentStatus) =>
  api.put(`/admin/orders/${id}/payment-status`, { paymentStatus }).then((r) => r.data);
export const adminDeleteOrder = (id) => api.delete(`/admin/orders/${id}`).then((r) => r.data);
