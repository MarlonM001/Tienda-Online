import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../data/db.js";
import { requireCustomer } from "../middleware/auth.js";

const router = Router();

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address };
}

function issueToken(user) {
  return jwt.sign({ userId: user.id, role: "customer" }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}

router.post("/register", async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const exists = db.data.users.find((u) => u.email === normalizedEmail);
  if (exists) {
    return res.status(409).json({ error: "Ya existe una cuenta con ese correo" });
  }

  const now = new Date().toISOString();
  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    phone: phone?.trim() || "",
    address: "",
    passwordHash: await bcrypt.hash(password, 10),
    createdAt: now,
  };

  db.data.users.push(user);
  await db.write();

  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = (email || "").trim().toLowerCase();
  const user = db.data.users.find((u) => u.email === normalizedEmail);

  const valid = user && (await bcrypt.compare(password || "", user.passwordHash));
  if (!valid) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }
  if (user.banned) {
    return res.status(403).json({ error: "Tu cuenta ha sido suspendida" });
  }

  res.json({ token: issueToken(user), user: publicUser(user) });
});

router.get("/me", requireCustomer, (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(publicUser(user));
});

router.put("/me", requireCustomer, async (req, res) => {
  const user = db.data.users.find((u) => u.id === req.user.userId);
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const { name, phone, address } = req.body;
  if (name !== undefined) user.name = name.trim();
  if (phone !== undefined) user.phone = phone.trim();
  if (address !== undefined) user.address = address.trim();
  await db.write();

  res.json(publicUser(user));
});

export default router;
