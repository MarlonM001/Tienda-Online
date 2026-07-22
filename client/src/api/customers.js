import api from "./client";

export const adminGetCustomers = () => api.get("/admin/users").then((r) => r.data);
export const adminBanCustomer = (id, banned) =>
  api.put(`/admin/users/${id}/ban`, { banned }).then((r) => r.data);
export const adminDeleteCustomer = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
