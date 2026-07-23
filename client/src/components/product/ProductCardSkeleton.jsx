export default function ProductCardSkeleton() {
  return (
    <div className="card blueprint elev-sm" style={{ padding: 0, overflow: "hidden" }}>
      <div className="skeleton" style={{ aspectRatio: "1", borderBottom: "1px solid var(--color-divider)" }} />
      <div style={{ padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: 8 }}>
        <div className="skeleton" style={{ width: 64, height: 16, borderRadius: 999 }} />
        <div className="skeleton" style={{ width: "80%", height: 18, borderRadius: 4 }} />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
          <div className="skeleton" style={{ width: 70, height: 18, borderRadius: 4 }} />
          <div className="skeleton" style={{ width: 80, height: 28, borderRadius: 4 }} />
        </div>
      </div>
    </div>
  );
}
