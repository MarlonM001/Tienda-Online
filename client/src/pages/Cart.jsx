import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import { formatCurrency } from "../utils/formatCurrency";
import { getImageUrl } from "../utils/getImageUrl";

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const { isAuthenticated } = useCustomerAuth();
  const navigate = useNavigate();

  return (
    <div style={{ animation: "pageFade 0.4s ease both", padding: "var(--space-4)", maxWidth: 800, width: "100%", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 32, margin: "0 0 var(--space-4) 0", color: "var(--color-text)" }}>
        Tu carrito
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-6) 0", opacity: 0.6 }}>
          <p style={{ fontSize: 16, marginBottom: "var(--space-3)" }}>Tu carrito está vacío.</p>
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Ir al catálogo
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          {items.map((line) => (
            <div
              key={line.productId}
              className="card"
              style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-3)", alignItems: "center", padding: "var(--space-3)" }}
            >
              <img
                src={getImageUrl(line.image) || undefined}
                alt={line.name}
                style={{ width: 72, height: 72, objectFit: "cover", border: "1px solid var(--color-divider)", background: "var(--color-surface)", flexShrink: 0 }}
              />
              <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 17 }}>{line.name}</span>
                <span style={{ fontSize: 13, opacity: 0.6 }}>{formatCurrency(line.price)} c/u</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginLeft: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-divider)", borderRadius: "var(--radius-sm)" }}>
                  <button className="btn btn-ghost" style={{ padding: "4px 10px" }} onClick={() => updateQty(line.productId, line.quantity - 1)}>
                    −
                  </button>
                  <span style={{ minWidth: 26, textAlign: "center", fontSize: 14 }}>{line.quantity}</span>
                  <button className="btn btn-ghost" style={{ padding: "4px 10px" }} onClick={() => updateQty(line.productId, line.quantity + 1)}>
                    +
                  </button>
                </div>
                <span style={{ fontWeight: 700, minWidth: 90, textAlign: "right", color: "var(--color-accent-700)" }}>
                  {formatCurrency(line.price * line.quantity)}
                </span>
                <button className="btn btn-icon" onClick={() => removeItem(line.productId)} aria-label="Quitar">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-4)",
              alignItems: "center",
              padding: "var(--space-4) 0",
              borderTop: "1px solid var(--color-divider)",
              marginTop: "var(--space-2)",
            }}
          >
            <span style={{ fontSize: 16, opacity: 0.7 }}>Total</span>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 26, color: "var(--color-accent-700)" }}>
              {formatCurrency(total)}
            </span>
          </div>
          {!isAuthenticated && (
            <p style={{ fontSize: 13, opacity: 0.7, textAlign: "right", margin: 0 }}>
              Necesitás iniciar sesión o crear una cuenta para completar tu compra.
            </p>
          )}
          <div style={{ display: "flex", gap: "var(--space-3)", justifyContent: "flex-end" }}>
            <button className="btn btn-secondary" onClick={() => navigate("/")}>Seguir comprando</button>
            <button className="btn btn-primary" onClick={() => navigate("/checkout")}>
              {isAuthenticated ? "Finalizar compra" : "Iniciar sesión y comprar"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
