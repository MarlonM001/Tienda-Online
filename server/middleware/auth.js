import jwt from "jsonwebtoken";
import db from "../data/db.js";

export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

export function requireCustomer(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "No autorizado" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.role !== "customer") throw new Error("rol inválido");

    const user = db.data.users.find((u) => u.id === payload.userId);
    if (!user) throw new Error("usuario no encontrado");
    if (user.banned) {
      return res.status(403).json({ error: "Tu cuenta ha sido suspendida" });
    }

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}

// No exige sesión, pero si viene un token de cliente válido lo deja en req.user.
// Así el checkout sigue funcionando como invitado y, si hay sesión, el pedido queda asociado.
export function attachUserIfPresent(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      if (payload.role === "customer") req.user = payload;
    } catch {
      // token ausente/inválido: se continúa como invitado
    }
  }
  next();
}
