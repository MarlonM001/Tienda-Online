import { Router } from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../data/db.js";
import { requireAdmin } from "../middleware/auth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});
const upload = multer({ storage });

const router = Router();

const ORDER_STATUSES = [
  "pendiente",
  "confirmado",
  "enviado",
  "entregado",
  "cancelado",
];

// --- Auth ---

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== process.env.ADMIN_USERNAME) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const valid = await bcrypt.compare(
    password || "",
    process.env.ADMIN_PASSWORD_HASH || ""
  );
  if (!valid) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = jwt.sign({ role: "admin", username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

  res.json({ token });
});

// Everything below requires a valid admin token
router.use(requireAdmin);

// --- Products ---

router.get("/products", (req, res) => {
  res.json(db.data.products);
});

router.post("/products", upload.array("images", 5), async (req, res) => {
  const { name, description, price, stock, category, gender, active } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Nombre y precio son obligatorios" });
  }

  const now = new Date().toISOString();
  const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

  const product = {
    id: crypto.randomUUID(),
    name,
    description: description || "",
    price: Number(price),
    stock: Number(stock) || 0,
    category: category || "General",
    gender: gender || "Unisex",
    images,
    active: active === undefined ? true : active === "true" || active === true,
    createdAt: now,
    updatedAt: now,
  };

  db.data.products.push(product);
  await db.write();

  res.status(201).json(product);
});

router.put("/products/:id", upload.array("images", 5), async (req, res) => {
  const product = db.data.products.find((p) => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const { name, description, price, stock, category, gender, active } = req.body;

  if (name !== undefined) product.name = name;
  if (description !== undefined) product.description = description;
  if (price !== undefined) product.price = Number(price);
  if (stock !== undefined) product.stock = Number(stock);
  if (category !== undefined) product.category = category;
  if (gender !== undefined) product.gender = gender;
  if (active !== undefined) product.active = active === "true" || active === true;

  if (req.files && req.files.length > 0) {
    product.images = req.files.map((f) => `/uploads/${f.filename}`);
  }

  product.updatedAt = new Date().toISOString();
  await db.write();

  res.json(product);
});

router.delete("/products/:id", async (req, res) => {
  const index = db.data.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  db.data.products.splice(index, 1);
  await db.write();

  res.status(204).end();
});

// --- Orders ---

router.get("/orders", (req, res) => {
  const { status } = req.query;
  let orders = [...db.data.orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt)
  );

  if (status) {
    orders = orders.filter((o) => o.status === status);
  }

  res.json(orders);
});

router.get("/orders/:id", (req, res) => {
  const order = db.data.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }
  res.json(order);
});

router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!ORDER_STATUSES.includes(status)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  const order = db.data.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  order.status = status;
  order.updatedAt = new Date().toISOString();
  await db.write();

  res.json(order);
});

const PAYMENT_STATUSES = ["pendiente", "pagado"];

router.put("/orders/:id/payment-status", async (req, res) => {
  const { paymentStatus } = req.body;

  if (!PAYMENT_STATUSES.includes(paymentStatus)) {
    return res.status(400).json({ error: "Estado de pago inválido" });
  }

  const order = db.data.orders.find((o) => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  order.paymentStatus = paymentStatus;
  order.updatedAt = new Date().toISOString();
  await db.write();

  res.json(order);
});

router.delete("/orders/:id", async (req, res) => {
  const index = db.data.orders.findIndex((o) => o.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Pedido no encontrado" });
  }

  db.data.orders.splice(index, 1);
  await db.write();

  res.status(204).end();
});

// --- Clientes ---

router.put("/users/:id/ban", async (req, res) => {
  const { banned } = req.body;
  const user = db.data.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ error: "Cliente no encontrado" });
  }

  user.banned = !!banned;
  await db.write();

  res.json({ id: user.id, banned: user.banned });
});

router.delete("/users/:id", async (req, res) => {
  const index = db.data.users.findIndex((u) => u.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Cliente no encontrado" });
  }

  db.data.users.splice(index, 1);
  await db.write();

  res.status(204).end();
});

router.get("/users", (req, res) => {
  const users = [...db.data.users]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((u) => {
      const userOrders = db.data.orders.filter((o) => o.userId === u.id);
      const activeOrders = userOrders.filter((o) => o.status !== "cancelado");
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        address: u.address,
        createdAt: u.createdAt,
        banned: !!u.banned,
        orderCount: userOrders.length,
        totalSpent: activeOrders.reduce((sum, o) => sum + o.total, 0),
      };
    });

  res.json(users);
});

export default router;
