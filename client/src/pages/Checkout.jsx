import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { createOrder } from "../api/orders";
import { buildWhatsAppLink } from "../utils/buildWhatsAppMessage";
import { formatCurrency } from "../utils/formatCurrency";
import WhatsAppIcon from "../components/icons/WhatsAppIcon";

const PAYMENT_OPTIONS = [
  { value: "efectivo_contraentrega", label: "Pago contraentrega" },
  { value: "transferencia", label: "Transferencia bancaria" },
  { value: "pago_anticipado", label: "Pago anticipado" },
];

export default function Checkout() {
  const { items, total, clear } = useCart();
  const { user } = useCustomerAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("whatsapp");
  const [paymentMethod, setPaymentMethod] = useState("efectivo_contraentrega");
  const [customer, setCustomer] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return <Navigate to="/" replace />;
  }

  const buildOrderPayload = (method) => ({
    items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    customer,
    paymentMethod: method,
  });

  const validCustomer = customer.name.trim() && customer.phone.trim() && customer.address.trim();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validCustomer) {
      setFormError("Completá nombre, teléfono y dirección para continuar.");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const order = await createOrder(buildOrderPayload(paymentMethod));
      clear();
      navigate("/pedido-confirmado", { state: { order } });
    } catch (err) {
      toast.error(err.response?.data?.error || "No se pudo crear el pedido");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (!validCustomer) {
      toast.error("Completá nombre, teléfono y dirección primero");
      return;
    }
    createOrder(buildOrderPayload("whatsapp"))
      .then(() => clear())
      .catch(() => toast.error("El pedido no se pudo registrar, pero podés seguir por WhatsApp"));
  };

  const waLink = buildWhatsAppLink(items, customer, total);

  return (
    <div style={{ animation: "pageFade 0.4s ease both", padding: "var(--space-4)", maxWidth: 640, width: "100%", margin: "0 auto" }}>
      <button className="btn btn-ghost" style={{ marginBottom: "var(--space-3)", paddingLeft: 0 }} onClick={() => navigate("/cart")}>
        <ArrowLeft size={16} />
        Volver al carrito
      </button>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 32, margin: "0 0 var(--space-4) 0", color: "var(--color-text)" }}>
        Finalizar pedido
      </h1>

      <div className="seg" style={{ marginBottom: "var(--space-4)", maxWidth: 420 }}>
        <label className="seg-opt">
          <input type="radio" name="checkoutTab" checked={tab === "whatsapp"} onChange={() => setTab("whatsapp")} />
          WhatsApp
        </label>
        <label className="seg-opt">
          <input type="radio" name="checkoutTab" checked={tab === "formal"} onChange={() => setTab("formal")} />
          Contraentrega / Transferencia
        </label>
      </div>

      <div className="card" style={{ padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
        <div className="card-kicker">Resumen del pedido</div>
        {items.map((line) => (
          <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" }}>
            <span>{line.quantity} × {line.name}</span>
            <span>{formatCurrency(line.price * line.quantity)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, paddingTop: "var(--space-2)", marginTop: "var(--space-2)", borderTop: "1px solid var(--color-divider)" }}>
          <span>Total</span>
          <span style={{ color: "var(--color-accent-700)" }}>{formatCurrency(total)}</span>
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div className="field">
          <label>Nombre completo</label>
          <input className="input" type="text" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} placeholder="Juan Pérez" />
        </div>
        <div className="field">
          <label>Teléfono</label>
          <input className="input" type="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} placeholder="300 123 4567" />
        </div>
        <div className="field">
          <label>Dirección de entrega</label>
          <input className="input" type="text" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} placeholder="Calle 10 # 20-30, Bogotá" />
        </div>
        <div className="field">
          <label>Notas (opcional)</label>
          <input className="input" type="text" value={customer.notes} onChange={(e) => setCustomer({ ...customer, notes: e.target.value })} placeholder="Referencia, horario de entrega, etc." />
        </div>
      </div>

      {tab === "whatsapp" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", alignItems: "flex-start" }}>
          <p style={{ fontSize: 14, opacity: 0.75, margin: 0 }}>
            Se abrirá WhatsApp con el resumen de tu pedido ya redactado, listo para enviar.
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="whatsapp-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#25D366",
              color: "#fff",
              border: "none",
              padding: "14px 22px",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              width: "100%",
              justifyContent: "center",
              textDecoration: "none",
            }}
          >
            <WhatsAppIcon />
            Enviar pedido por WhatsApp
          </a>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="field">
            <label>Método de pago</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: 4 }}>
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.value} className="radio">
                  <input
                    type="radio"
                    name="payMethod"
                    checked={paymentMethod === opt.value}
                    onChange={() => setPaymentMethod(opt.value)}
                  />
                  <span className="dot"></span>
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          {formError && <span style={{ fontSize: 13, color: "var(--color-accent-900)" }}>{formError}</span>}

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: "var(--space-2)" }}>
            {submitting ? "Enviando..." : "Confirmar pedido"}
          </button>
        </form>
      )}
    </div>
  );
}
