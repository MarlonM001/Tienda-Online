import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Trash2 } from "lucide-react";
import { adminGetOrders, adminUpdateOrderStatus, adminUpdatePaymentStatus, adminDeleteOrder } from "../../api/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import OrderStatusBadge from "../../components/admin/OrderStatusBadge";
import PaymentStatusBadge from "../../components/admin/PaymentStatusBadge";
import { STATUS_LABELS, PAYMENT_STATUS_LABELS } from "../../constants/orderStatus";
import Spinner from "../../components/ui/Spinner";

const STATUSES = ["pendiente", "confirmado", "enviado", "entregado", "cancelado"];
const PAYMENT_STATUSES = ["pendiente", "pagado"];

const PAYMENT_LABELS = {
  whatsapp: "WhatsApp",
  efectivo_contraentrega: "Contraentrega",
  transferencia: "Transferencia",
  pago_anticipado: "Pago anticipado",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");

  const load = () => adminGetOrders(statusFilter || undefined).then(setOrders);

  useEffect(() => {
    load();
  }, [statusFilter]);

  const q = search.trim().toLowerCase();
  const filtered = (orders || []).filter(
    (o) =>
      (!paymentFilter || (o.paymentStatus || "pendiente") === paymentFilter) &&
      (!q || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q))
  );

  const handleStatusChange = async (order, status) => {
    try {
      const updated = await adminUpdateOrderStatus(order.id, status);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      toast.success("Estado actualizado");
    } catch {
      toast.error("No se pudo actualizar el pedido");
    }
  };

  const handleTogglePayment = async (order) => {
    const next = order.paymentStatus === "pagado" ? "pendiente" : "pagado";
    try {
      const updated = await adminUpdatePaymentStatus(order.id, next);
      setOrders((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
      toast.success(next === "pagado" ? "Pago marcado como aprobado" : "Pago marcado como pendiente");
    } catch {
      toast.error("No se pudo actualizar el pago");
    }
  };

  const handleDelete = async (order) => {
    if (!confirm(`¿Eliminar el pedido #${order.id.slice(-6).toUpperCase()}? Esta acción no se puede deshacer.`)) return;
    try {
      await adminDeleteOrder(order.id);
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      toast.success("Pedido eliminado");
    } catch {
      toast.error("No se pudo eliminar el pedido");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Pedidos</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar cliente o teléfono..."
              className="rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            />
          </div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          >
            <option value="">Todos los pagos</option>
            {PAYMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {PAYMENT_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          >
            <option value="">Todos los estados</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {orders === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {search || paymentFilter || statusFilter ? "No hay pedidos que coincidan con el filtro." : "No hay pedidos."}
        </p>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border border-neutral-200 p-5 dark:border-neutral-800"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-neutral-900 dark:text-neutral-100">
                    {order.customer.name} &middot; {order.customer.phone}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {order.customer.address}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    #{order.id.slice(-6).toUpperCase()} &middot;{" "}
                    {new Date(order.createdAt).toLocaleString("es-CO", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">
                    {PAYMENT_LABELS[order.paymentMethod]}
                  </span>
                  <button onClick={() => handleTogglePayment(order)} className="cursor-pointer">
                    <PaymentStatusBadge status={order.paymentStatus || "pendiente"} />
                  </button>
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <ul className="mt-3 space-y-1 text-sm text-neutral-600 dark:text-neutral-300">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.quantity}x {item.name} — {formatCurrency(item.subtotal)}
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Total: {formatCurrency(order.total)}
                </span>
                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order, e.target.value)}
                    className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(order)}
                    title="Eliminar pedido"
                    className="text-neutral-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
