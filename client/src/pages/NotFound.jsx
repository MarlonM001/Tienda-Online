import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "var(--space-8) var(--space-4)", textAlign: "center" }}>
      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 40 }}>404</h1>
      <p style={{ opacity: 0.7 }}>Página no encontrada.</p>
      <button className="btn btn-secondary" style={{ marginTop: "var(--space-4)" }} onClick={() => navigate("/")}>
        Volver al inicio
      </button>
    </div>
  );
}
