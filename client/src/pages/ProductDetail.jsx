import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { getProduct } from "../api/products";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/formatCurrency";
import { getImageUrl } from "../utils/getImageUrl";
import Spinner from "../components/ui/Spinner";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .catch(() => setProduct(false))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-8) 0" }}>
        <Spinner />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "var(--space-8) var(--space-4)", textAlign: "center" }}>
        <p style={{ opacity: 0.7 }}>Producto no encontrado.</p>
        <button className="btn btn-secondary" style={{ marginTop: "var(--space-4)" }} onClick={() => navigate("/")}>
          Volver al catálogo
        </button>
      </div>
    );
  }

  const image = getImageUrl(product.images?.[0]);
  const outOfStock = product.stock === 0;

  return (
    <div style={{ animation: "pageFade 0.4s ease both", padding: "var(--space-4)", maxWidth: 1000, width: "100%", margin: "0 auto" }}>
      <button className="btn btn-ghost" style={{ marginBottom: "var(--space-4)", paddingLeft: 0 }} onClick={() => navigate("/")}>
        <ArrowLeft size={16} />
        Volver al catálogo
      </button>

      <div className="split-grid">
        <div className="blueprint" style={{ position: "relative", border: "1px solid var(--color-divider)", aspectRatio: "1", overflow: "hidden", background: "var(--color-surface)" }}>
          <i className="corner tl"></i>
          <i className="corner tr"></i>
          <i className="corner bl"></i>
          <i className="corner br"></i>
          {image ? (
            <img src={image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
              Sin imagen
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div style={{ display: "flex", gap: 6 }}>
            <span className="tag tag-accent">{product.category}</span>
            {product.gender && product.gender !== "Unisex" && (
              <span className="tag tag-outline">{product.gender}</span>
            )}
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 36, margin: 0, color: "var(--color-text)" }}>
            {product.name}
          </h1>
          <span style={{ fontSize: 26, fontWeight: 700, color: "var(--color-accent-700)" }}>
            {formatCurrency(product.price)}
          </span>
          <p style={{ fontSize: 15, lineHeight: 1.6, opacity: 0.8, margin: 0 }}>{product.description}</p>
          <span style={{ fontSize: 13, opacity: 0.6 }}>
            {outOfStock ? "Sin stock disponible" : `${product.stock} unidades disponibles`}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--color-divider)", borderRadius: "var(--radius-sm)" }}>
              <button className="btn btn-ghost" style={{ padding: "8px 12px" }} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                −
              </button>
              <span style={{ minWidth: 32, textAlign: "center", fontWeight: 600 }}>{quantity}</span>
              <button
                className="btn btn-ghost"
                style={{ padding: "8px 12px" }}
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary btn-block"
            disabled={outOfStock}
            style={{ marginTop: "var(--space-3)" }}
            onClick={() => {
              addItem(product, quantity);
              setJustAdded(true);
              setTimeout(() => setJustAdded(false), 1600);
            }}
          >
            <ShoppingBag size={16} />
            Agregar al carrito
          </button>
          {justAdded && (
            <span style={{ fontSize: 13, color: "var(--color-accent-700)", animation: "popIn 0.25s ease" }}>
              Agregado al carrito ✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
