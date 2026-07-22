import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6) var(--space-4)",
        overflow: "hidden",
        backgroundImage:
          "repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-text) 6%, transparent) 0, color-mix(in srgb, var(--color-text) 6%, transparent) 1px, transparent 1px, transparent 14px)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "radial-gradient(circle, var(--color-accent-100), transparent 70%)",
          opacity: 0.8,
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="blueprint"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 420,
          background: "var(--color-bg)",
          border: "1px solid var(--color-divider)",
          boxShadow: "var(--shadow-lg)",
          padding: "var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <i className="corner tl"></i>
        <i className="corner tr"></i>
        <i className="corner bl"></i>
        <i className="corner br"></i>

        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--color-accent-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "var(--space-2)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18"></rect>
            <path d="M3 9h18M9 21V9"></path>
          </svg>
        </div>

        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 26, margin: 0, color: "var(--color-text)" }}>
          {title}
        </h1>
        <p style={{ fontSize: 13, opacity: 0.7, margin: "0 0 var(--space-2) 0" }}>{subtitle}</p>

        {children}
      </motion.div>
    </div>
  );
}
