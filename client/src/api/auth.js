import api from "./client";

export const login = (username, password) =>
  api.post("/admin/login", { username, password }).then((r) => r.data);
