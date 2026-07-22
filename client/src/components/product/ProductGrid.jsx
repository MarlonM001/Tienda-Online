import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-6) 0", opacity: 0.6 }}>
        <p style={{ fontSize: 16 }}>No encontramos productos.</p>
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "var(--space-4)" }}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} delayMs={Math.min(i, 15) * 35} />
      ))}
    </div>
  );
}
