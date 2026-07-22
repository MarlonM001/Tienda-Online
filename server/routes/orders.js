import { Router } from "express";
import db from "../data/db.js";
import { requireCustomer, attachUserIfPresent } from "../middleware/auth.js";

const router = Router();

const PAYMENT_METHODS = [
  "whatsapp",
  "efectivo_contraentrega",
  "transferencia",
  "pago_anticipado",
];

router.get("/mine", requireCustomer, (req, res) => {
  const orders = db.data.orders
    .filter((o) => o.userId === req.user.userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json(orders);
});

router.post("/", attachUserIfPresent, async (req, res) => {
  const { items, customer, paymentMethod } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "El pedido no tiene items" });
  }
  if (!customer?.name || !customer?.phone || !customer?.address) {
    return res
      .status(400)
      .json({ error: "Faltan datos del cliente (nombre, teléfono, dirección)" });
  }
  if (!PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ error: "Método de pago inválido" });
  }
  if (req.user) {
    const user = db.data.users.find((u) => u.id === req.user.userId);
    if (user?.banned) {
      return res.status(403).json({ error: "Tu cuenta está suspendida y no puede hacer pedidos" });
    }
  }

  const now = new Date().toISOString();
  const orderItems = [];
  let total = 0;

  for (const item of items) {
    const product = db.data.products.find((p) => p.id === item.productId);
    if (!product) {
      return res
        .status(400)
        .json({ error: `Producto no encontrado: ${item.productId}` });
    }
    const quantity = Number(item.quantity) || 0;
    if (quantity <= 0) {
      return res.status(400).json({ error: "Cantidad inválida" });
    }
    const subtotal = product.price * quantity;
    total += subtotal;
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      subtotal,
    });
  }

  const order = {
    id: crypto.randomUUID(),
    userId: req.user?.userId || null,
    items: orderItems,
    total,
    customer: {
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      notes: customer.notes || "",
    },
    paymentMethod,
    status: "pendiente",
    paymentStatus: "pendiente",
    createdAt: now,
    updatedAt: now,
  };

  db.data.orders.push(order);
  await db.write();

  res.status(201).json(order);
});

export default router;
