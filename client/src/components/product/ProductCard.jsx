import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import { getImageUrl } from "../../utils/getImageUrl";

export default function ProductCard({ product, delayMs = 0 }) {
  const { addItem } = useCart();
  const image = getImageUrl(product.images?.[0]);
  const outOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delayMs / 1000, ease: [0.16, 1, 0.3, 1] }}
      className="card blueprint elev-sm product-card"
      style={{ padding: 0, overflow: "hidden", cursor: "pointer" }}
    >
      <i className="corner tl"></i>
      <i className="corner tr"></i>
      <i className="corner bl"></i>
      <i className="corner br"></i>

      <Link to={`/producto/${product.id}`} style={{ display: "contents" }}>
        <div
          style={{
            position: "relative",
            aspectRatio: "1",
            borderBottom: "1px solid var(--color-divider)",
            overflow: "hidden",
            background: "var(--color-surface)",
          }}
        >
          {image ? (
            <img
              src={image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", opacity: 0.4, fontSize: 13 }}>
              Sin imagen
            </div>
          )}
          {outOfStock && (
            <span className="tag tag-neutral" style={{ position: "absolute", top: 8, left: 8 }}>
              Agotado
            </span>
          )}
        </div>
        <div style={{ padding: "var(--space-3)", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
          <span className="tag tag-accent" style={{ alignSelf: "flex-start" }}>{product.category}</span>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: 18, color: "var(--color-text)", lineHeight: 1.2 }}>
            {product.name}
          </span>
          <div style={{ flex: 1 }}></div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 17, color: "var(--color-accent-700)" }}>
              {formatCurrency(product.price)}
            </span>
            <button
              className="btn btn-secondary"
              style={{ padding: "6px 10px", fontSize: 13 }}
              disabled={outOfStock}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem(product, 1);
                toast.success("Agregado al carrito");
              }}
            >
              ¡Lo quiero!
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
