import { Link } from "react-router-dom";

const STORE_NAME = "MERCADO CENTRAL";
const WHATSAPP_DISPLAY = "+57 300 123 4567";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--color-divider)",
        background: "var(--color-surface)",
        marginTop: "var(--space-6)",
      }}
    >
      <div
        className="footer-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "var(--space-6) var(--space-4)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18"></rect>
              <path d="M3 9h18M9 21V9"></path>
            </svg>
            <span style={{ fontFamily: "var(--font-heading)", fontSize: 18 }}>{STORE_NAME}</span>
          </div>
          <p style={{ fontSize: 13, opacity: 0.65, maxWidth: 320, margin: 0 }}>
            Tienda online de productos físicos con entrega en toda Colombia. Pagá contraentrega, por
            transferencia o coordiná todo por WhatsApp.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="card-kicker" style={{ marginBottom: 4 }}>Tienda</span>
          <Link to="/" style={{ fontSize: 13 }}>Catálogo</Link>
          <Link to="/cart" style={{ fontSize: 13 }}>Mi carrito</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="card-kicker" style={{ marginBottom: 4 }}>Ayuda</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>Envíos y entregas</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>Pagos y contraentrega</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>Cambios y devoluciones</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="card-kicker" style={{ marginBottom: 4 }}>Contacto</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>WhatsApp: {WHATSAPP_DISPLAY}</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>hola@mercadocentral.co</span>
          <span style={{ fontSize: 13, opacity: 0.75 }}>Bogotá, Colombia</span>
        </div>
      </div>
      <div
        style={{
          borderTop: "1px solid var(--color-divider)",
          padding: "var(--space-3) var(--space-4)",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-2)",
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >
        <span style={{ fontSize: 12, opacity: 0.55 }}>
          &copy; {new Date().getFullYear()} {STORE_NAME.charAt(0) + STORE_NAME.slice(1).toLowerCase()}. Todos los derechos reservados.
        </span>
        <span style={{ fontSize: 12, opacity: 0.55 }}>Contraentrega · Transferencia · WhatsApp</span>
      </div>
    </footer>
  );
}
