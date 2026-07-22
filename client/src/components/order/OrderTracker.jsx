import { Check } from "lucide-react";
import { STATUS_STEPS, STATUS_LABELS } from "../../constants/orderStatus";

export default function OrderTracker({ status }) {
  if (status === "cancelado") {
    return (
      <div
        style={{
          fontSize: 13,
          color: "#b91c1c",
          background: "rgba(220, 38, 38, 0.1)",
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-sm)",
        }}
      >
        Este pedido fue cancelado.
      </div>
    );
  }

  const currentIndex = Math.max(STATUS_STEPS.indexOf(status), 0);

  return (
    <div style={{ display: "flex" }}>
      {STATUS_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        const isLast = i === STATUS_STEPS.length - 1;
        return (
          <div key={step} style={{ display: "flex", alignItems: "flex-start", flex: isLast ? "0 0 auto" : 1 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: done || active ? "var(--color-accent)" : "var(--color-surface)",
                  color: done || active ? "#fff" : "var(--color-text)",
                  border: done || active ? "none" : "1px solid var(--color-divider)",
                }}
              >
                {done ? <Check size={13} /> : <span style={{ fontSize: 11, fontWeight: 700 }}>{i + 1}</span>}
              </div>
              <span
                style={{
                  fontSize: 11,
                  textAlign: "center",
                  opacity: active ? 1 : 0.6,
                  fontWeight: active ? 700 : 500,
                  maxWidth: 76,
                  lineHeight: 1.25,
                }}
              >
                {STATUS_LABELS[step]}
              </span>
            </div>
            {!isLast && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  marginTop: 11,
                  background: i < currentIndex ? "var(--color-accent)" : "var(--color-divider)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
