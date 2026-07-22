import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Check } from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";

const METHOD_LABELS = {
  whatsapp: "Pedido por WhatsApp",
  efectivo_contraentrega: "Pago contraentrega",
  transferencia: "Transferencia bancaria",
  pago_anticipado: "Pago anticipado",
};

export default function OrderConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.order) {
    return <Navigate to="/" replace />;
  }

  const { order } = state;
  const orderNumber = "#" + order.id.slice(-6).toUpperCase();

  return (
    <div
      style={{
        animation: "pageFade 0.4s ease both",
        padding: "var(--space-6) var(--space-4)",
        maxWidth: 640,
        width: "100%",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 999,
          background: "var(--color-accent)",
          color: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto var(--space-4)",
          animation: "popIn 0.4s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <Check size={30} />
      </div>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 30, margin: "0 0 6px 0" }}>¡Pedido recibido!</h1>
      <p style={{ opacity: 0.7, margin: "0 0 var(--space-4) 0" }}>
        Número de pedido <strong>{orderNumber}</strong> — {METHOD_LABELS[order.paymentMethod]}
      </p>

      <div className="card" style={{ textAlign: "left", padding: "var(--space-4)", marginBottom: "var(--space-4)" }}>
        <div className="card-kicker">Resumen</div>
        {order.items.map((line) => (
          <div key={line.productId} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, padding: "4px 0" }}>
            <span>{line.quantity} × {line.name}</span>
            <span>{formatCurrency(line.subtotal)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, paddingTop: "var(--space-2)", marginTop: "var(--space-2)", borderTop: "1px solid var(--color-divider)" }}>
          <span>Total</span>
          <span style={{ color: "var(--color-accent-700)" }}>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Volver a la tienda
      </button>
    </div>
  );
}
