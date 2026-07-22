import { Router } from "express";
import db from "../data/db.js";

const router = Router();

router.get("/", (req, res) => {
  const { category, search } = req.query;
  let products = db.data.products.filter((p) => p.active);

  if (category) {
    products = products.filter(
      (p) => p.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  if (search) {
    const term = String(search).toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(term));
  }

  res.json(products);
});

router.get("/:id", (req, res) => {
  const product = db.data.products.find(
    (p) => p.id === req.params.id && p.active
  );

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});

export default router;
