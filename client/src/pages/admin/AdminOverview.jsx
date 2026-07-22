import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminGetProducts } from "../../api/products";
import { adminGetOrders } from "../../api/orders";
import { adminGetCustomers } from "../../api/customers";
import { formatCurrency } from "../../utils/formatCurrency";
import Spinner from "../../components/ui/Spinner";
import RevenueChart from "../../components/admin/RevenueChart";

function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

export default function AdminOverview() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([adminGetProducts(), adminGetOrders(), adminGetCustomers()]).then(([products, orders, customers]) => {
      const activeOrders = orders.filter((o) => o.status !== "cancelado");
      const revenueDays = lastNDays(7).map((d) => {
        const key = d.toISOString().slice(0, 10);
        const revenue = activeOrders
          .filter((o) => o.createdAt.slice(0, 10) === key)
          .reduce((sum, o) => sum + o.total, 0);
        return { label: d.toLocaleDateString("es-CO", { weekday: "short" }), revenue };
      });

      setStats({
        customers: customers.length,
        products: products.length,
        lowStock: products.filter((p) => p.stock > 0 && p.stock <= 5).length,
        outOfStock: products.filter((p) => p.stock === 0).length,
        pendingOrders: orders.filter((o) => o.status === "pendiente").length,
        paymentPending: activeOrders.filter((o) => o.paymentStatus !== "pagado").length,
        totalOrders: orders.length,
        totalRevenue: activeOrders.reduce((sum, o) => sum + o.total, 0),
        revenueDays,
      });
    });
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const cards = [
    { label: "Ingresos totales", value: formatCurrency(stats.totalRevenue) },
    { label: "Clientes registrados", value: stats.customers },
    { label: "Pedidos pendientes", value: stats.pendingOrders },
    { label: "Pagos por confirmar", value: stats.paymentPending },
    { label: "Productos", value: stats.products },
    { label: "Stock bajo (≤5)", value: stats.lowStock, warn: stats.lowStock > 0 },
    { label: "Agotados", value: stats.outOfStock, warn: stats.outOfStock > 0 },
  ];

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-neutral-900 dark:text-neutral-100">Resumen</h1>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
          >
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{c.label}</p>
            <p
              className={
                "mt-2 text-3xl font-bold " +
                (c.warn ? "text-amber-600 dark:text-amber-400" : "text-neutral-900 dark:text-neutral-100")
              }
            >
              {c.value}
            </p>
          </motion.div>
        ))}
      </div>

      <RevenueChart days={stats.revenueDays} />
    </div>
  );
}
