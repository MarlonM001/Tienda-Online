import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { updateMe } from "../api/customerAuth";
import { getMyOrders } from "../api/orders";
import { formatCurrency } from "../utils/formatCurrency";
import OrderStatusBadge from "../components/admin/OrderStatusBadge";
import PaymentStatusBadge from "../components/admin/PaymentStatusBadge";
import OrderTracker from "../components/order/OrderTracker";
import Spinner from "../components/ui/Spinner";

const EASE = [0.16, 1, 0.3, 1];

export default function Account() {
  const { user, updateUser, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone, address: user.address });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => toast.error("No se pudo cargar tu historial de pedidos"))
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateMe(profile);
      updateUser(updated);
      toast.success("Datos actualizados");
    } catch {
      toast.error("No se pudieron guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div style={{ animation: "pageFade 0.4s ease both", padding: "var(--space-6) var(--space-4)", maxWidth: 720, width: "100%", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 30, margin: 0, color: "var(--color-text)" }}>
          Mi cuenta
        </h1>
        <button className="btn btn-secondary" onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        onSubmit={handleSave}
        className="card"
        style={{ padding: "var(--space-4)", marginBottom: "var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
      >
        <div className="card-kicker">Mis datos</div>
        <div className="field">
          <label>Correo electrónico</label>
          <input className="input" type="email" value={user.email} disabled style={{ opacity: 0.6 }} />
        </div>
        <div className="field">
          <label>Nombre completo</label>
          <input
            className="input"
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="field">
          <label>Teléfono</label>
          <input
            className="input"
            type="tel"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            placeholder="300 123 4567"
          />
        </div>
        <div className="field">
          <label>Dirección de entrega habitual</label>
          <input
            className="input"
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            placeholder="Calle 10 # 20-30, Bogotá"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </motion.form>

      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 22, margin: "0 0 var(--space-3) 0", color: "var(--color-text)" }}>
        Mis pedidos
      </h2>

      {loadingOrders ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-6) 0" }}>
          <Spinner />
        </div>
      ) : orders.length === 0 ? (
        <p style={{ fontSize: 14, opacity: 0.7 }}>Todavía no has hecho ningún pedido.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
              className="card"
              style={{ padding: "var(--space-4)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-3)", flexWrap: "wrap", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 16 }}>
                  Pedido #{order.id.slice(-6).toUpperCase()}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <PaymentStatusBadge status={order.paymentStatus || "pendiente"} />
                  <OrderStatusBadge status={order.status} />
                </div>
              </div>

              <div style={{ marginBottom: "var(--space-3)", overflowX: "auto" }}>
                <OrderTracker status={order.status} />
              </div>

              {order.items.map((line) => (
                <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, opacity: 0.85, padding: "3px 0" }}>
                  <span>{line.quantity} × {line.name}</span>
                  <span>{formatCurrency(line.subtotal)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, paddingTop: "var(--space-2)", marginTop: "var(--space-2)", borderTop: "1px solid var(--color-divider)" }}>
                <span>Total</span>
                <span style={{ color: "var(--color-accent-700)" }}>{formatCurrency(order.total)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
