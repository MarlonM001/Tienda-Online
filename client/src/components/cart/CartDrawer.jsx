import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/getImageUrl";

export default function CartDrawer() {
  const { items, total, count, updateQty, isOpen, closeDrawer } = useCart();
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <div
          onClick={closeDrawer}
          style={{
            position: "fixed",
            inset: 0,
            background: "color-mix(in srgb, #000 45%, transparent)",
            zIndex: 40,
            animation: "pageFade 0.25s ease",
          }}
        />
      )}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(400px, 100vw)",
          background: "var(--color-bg)",
          borderLeft: "1px solid var(--color-divider)",
          zIndex: 50,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(.32,.72,0,1)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "var(--space-4)",
            borderBottom: "1px solid var(--color-divider)",
          }}
        >
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 20 }}>Tu carrito</span>
          <button className="btn btn-icon" onClick={closeDrawer} aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--space-3)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {items.length === 0 && (
            <p style={{ opacity: 0.6, textAlign: "center", marginTop: "var(--space-4)", fontSize: 14 }}>
              Tu carrito está vacío.
            </p>
          )}
          <AnimatePresence initial={false}>
          {items.map((line) => (
            <motion.div
              key={line.productId}
              layout
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24, height: 0, marginBottom: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}
            >
              <img
                src={getImageUrl(line.image) || undefined}
                alt={line.name}
                style={{ width: 56, height: 56, objectFit: "cover", border: "1px solid var(--color-divider)", background: "var(--color-surface)" }}
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 14, fontFamily: "var(--font-heading)" }}>{line.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: "2px 8px", fontSize: 13 }}
                    onClick={() => updateQty(line.productId, line.quantity - 1)}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ fontSize: 13, minWidth: 16, textAlign: "center" }}>{line.quantity}</span>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: "2px 8px", fontSize: 13 }}
                    onClick={() => updateQty(line.productId, line.quantity + 1)}
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-accent-700)" }}>
                {formatCurrency(line.price * line.quantity)}
              </span>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>

        <div
          style={{
            padding: "var(--space-4)",
            borderTop: "1px solid var(--color-divider)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
            <span style={{ opacity: 0.7 }}>Total</span>
            <span style={{ fontWeight: 700, color: "var(--color-accent-700)" }}>{formatCurrency(total)}</span>
          </div>
          <button
            className="btn btn-secondary"
            onClick={() => {
              closeDrawer();
              navigate("/cart");
            }}
          >
            Ver carrito completo
          </button>
          <button
            className="btn btn-primary"
            disabled={count === 0}
            onClick={() => {
              closeDrawer();
              navigate("/checkout");
            }}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </>
  );
}
