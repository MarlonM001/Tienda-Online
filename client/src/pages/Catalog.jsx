import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, MessageCircle, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts } from "../api/products";
import ProductGrid from "../components/product/ProductGrid";
import ProductCardSkeleton from "../components/product/ProductCardSkeleton";
import { getImageUrl } from "../utils/getImageUrl";
import { CATEGORIES } from "../constants/categories";

const EASE = [0.16, 1, 0.3, 1];
const HERO_CATEGORIES = CATEGORIES.slice(0, 4);
const WHATSAPP_NUMBER = import.meta.env.VITE_STORE_WHATSAPP_NUMBER;

const HERO_SLIDES = [
  {
    badge: "¡Gracias por acompañarnos en nuestra inauguración!",
    title: "Todo lo que buscás, entregado en la puerta de tu casa",
    text: "Ropa urbana, ropa deportiva y gorras. Pedí por WhatsApp o pagá contraentrega, sin vueltas.",
    category: null,
  },
  {
    badge: "Nueva colección",
    title: "Estilo urbano que se nota",
    text: "Hoodies, camisetas oversize y gorras pensadas para el día a día en la ciudad.",
    category: "Ropa Urbana",
  },
  {
    badge: "Entrená con actitud",
    title: "Ropa deportiva para hombre y mujer",
    text: "Comodidad y rendimiento para tus rutinas, sin sacrificar estilo.",
    category: "Ropa Deportiva",
  },
];

const REVIEWS = [
  { name: "Camila R.", text: "Pedí por WhatsApp y el mismo día ya tenía el pedido confirmado. Llegó rápido a Yopal.", stars: 5 },
  { name: "Andrés M.", text: "Pagué contraentrega sin problema, el vendedor fue muy claro con los tiempos de envío.", stars: 5 },
  { name: "Laura P.", text: "Buenos precios y buena calidad. Ya hice tres pedidos y todos llegaron completos.", stars: 4 },
  { name: "Jhon F.", text: "Excelente atención, coordinaron la entrega en Casanare sin ningún inconveniente.", stars: 5 },
];

const AVG_RATING = (REVIEWS.reduce((sum, r) => sum + r.stars, 0) / REVIEWS.length).toFixed(1);
const WHATSAPP_DISPLAY = "+57 300 123 4567";

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Stars({ count }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="none">
          <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"></path>
        </svg>
      ))}
    </div>
  );
}

export default function Catalog({ query, onQueryChange }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("cat");
  const gender = searchParams.get("genero");
  const setCategory = (cat) => {
    const next = {};
    if (cat) next.cat = cat;
    if (gender) next.genero = gender;
    setSearchParams(next);
  };
  const setGender = (g) => {
    const next = {};
    if (category) next.cat = category;
    if (g) next.genero = g;
    setSearchParams(next);
  };

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const heroImages = products
    .map((p) => getImageUrl(p.images?.[0]))
    .filter(Boolean)
    .slice(0, 6);

  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);

  useEffect(() => {
    if (heroPaused) return;
    const timer = setInterval(() => {
      setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroPaused]);

  const heroPrev = () => setHeroSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const heroNext = () => setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);

  const currentSlide = HERO_SLIDES[heroSlide];
  const slideImage =
    getImageUrl(products.find((p) => p.category === currentSlide.category)?.images?.[0]) ||
    heroImages[0];

  const q = query.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (!q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)) &&
      (!category || p.category === category) &&
      (!gender || (p.gender || "Unisex") === gender)
  );

  return (
    <div style={{ animation: "pageFade 0.4s ease both" }}>
      {/* Hero */}
      <div
        className="blueprint hero-bg"
        onMouseEnter={() => setHeroPaused(true)}
        onMouseLeave={() => setHeroPaused(false)}
        style={{
          position: "relative",
          borderBottom: "1px solid var(--color-divider)",
          padding: "var(--space-6) var(--space-4)",
          background: "var(--color-surface)",
          overflow: "hidden",
        }}
      >
        <i className="corner tl"></i>
        <i className="corner tr"></i>
        <i className="corner bl"></i>
        <i className="corner br"></i>

        <button
          onClick={heroPrev}
          aria-label="Diapositiva anterior"
          className="btn btn-icon"
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            borderRadius: "50%",
            background: "color-mix(in srgb, #000 40%, transparent)",
            border: "none",
            color: "#fff",
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={heroNext}
          aria-label="Siguiente diapositiva"
          className="btn btn-icon"
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            borderRadius: "50%",
            background: "color-mix(in srgb, #000 40%, transparent)",
            border: "none",
            color: "#fff",
          }}
        >
          <ChevronRight size={18} />
        </button>

        <div
          style={{
            position: "absolute",
            bottom: 10,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
            zIndex: 2,
          }}
        >
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroSlide(i)}
              aria-label={`Ir a la diapositiva ${i + 1}`}
              style={{
                width: i === heroSlide ? 18 : 7,
                height: 7,
                borderRadius: 999,
                border: "none",
                padding: 0,
                cursor: "pointer",
                background: i === heroSlide ? "var(--color-accent)" : "color-mix(in srgb, var(--color-text) 30%, transparent)",
                transition: "width 0.25s ease, background 0.25s ease",
              }}
            />
          ))}
        </div>

        <div
          className="hero-grid"
          style={{
            maxWidth: 1280,
            margin: "0 auto",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={heroSlide}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", gap: "var(--space-2)" }}
            >
              <span className="tag tag-accent">{currentSlide.badge}</span>
              <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 42, letterSpacing: "0.01em", margin: 0, color: "var(--color-text)" }}>
                {currentSlide.title}
              </h1>
              <p style={{ fontSize: 16, opacity: 0.7, margin: 0, maxWidth: 480 }}>{currentSlide.text}</p>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-4)", flexWrap: "wrap" }}>
                <a href="#catalogo" className="btn btn-primary">
                  Ver catálogo
                </a>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero más información sobre sus productos")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                >
                  Pedir por WhatsApp
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "var(--space-6) 0", position: "relative" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="blueprint"
              style={{
                position: "relative",
                width: "min(300px, 72%)",
                aspectRatio: "1",
                animation: "floaty 5s ease-in-out infinite",
                boxShadow: "var(--shadow-lg), 24px 34px 40px -18px color-mix(in srgb, var(--color-accent-900) 45%, transparent)",
                border: "1px solid var(--color-divider)",
                background: "var(--color-surface)",
                overflow: "hidden",
              }}
            >
              <i className="corner tl"></i>
              <i className="corner tr"></i>
              <i className="corner bl"></i>
              <i className="corner br"></i>
              <AnimatePresence mode="wait">
                {slideImage ? (
                  <motion.img
                    key={heroSlide}
                    src={slideImage}
                    alt=""
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div key="empty" style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", opacity: 0.6, fontSize: 13 }}>
                    Foto destacada de producto
                  </div>
                )}
              </AnimatePresence>
            </motion.div>

            {HERO_CATEGORIES.map((cat, i) => {
              const positions = [
                { top: "4%", left: "-6%" },
                { top: "8%", right: "-4%" },
                { bottom: "10%", left: "-8%" },
                { bottom: "2%", right: "-2%" },
              ];
              return (
                <motion.div
                  key={cat}
                  className="tag tag-accent"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1, ease: EASE }}
                  style={{
                    position: "absolute",
                    boxShadow: "var(--shadow-md)",
                    background: "var(--color-surface)",
                    animation: `floatyChip ${3.4 + i * 0.4}s ease-in-out infinite`,
                    animationDelay: `${i * 0.3}s`,
                    ...positions[i],
                  }}
                >
                  {cat}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Categorías destacadas */}
      <div style={{ padding: "var(--space-6) var(--space-4) 0", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ textAlign: "center", marginBottom: "var(--space-4)" }}
        >
          <span className="tag tag-outline">Explorá</span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: "8px 0 0 0" }}>
            Comprá por categoría
          </h2>
        </motion.div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-4)" }}>
          {CATEGORIES.map((cat, i) => {
            const sample = products.find((p) => p.category === cat && p.images?.[0]);
            const image = sample ? getImageUrl(sample.images[0]) : null;
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.06, ease: EASE }}
              >
                <Link
                  to={`/?cat=${encodeURIComponent(cat)}#catalogo`}
                  className="blueprint category-tile"
                  style={{ position: "relative", display: "block", aspectRatio: "4/3", overflow: "hidden" }}
                >
                  <i className="corner tl"></i>
                  <i className="corner tr"></i>
                  <i className="corner bl"></i>
                  <i className="corner br"></i>
                  {image ? (
                    <img
                      src={image}
                      alt={cat}
                      className="category-tile-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "var(--color-accent-100)" }} />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--color-accent-900) 80%, transparent) 100%)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      padding: "var(--space-3)",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-heading)", fontSize: 20, color: "#fff" }}>{cat}</span>
                    <span style={{ fontSize: 13, color: "#fff", opacity: 0.9, display: "flex", alignItems: "center", gap: 4 }}>
                      ¡Ver más! <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Catálogo */}
      <div id="catalogo" style={{ padding: "var(--space-4)", maxWidth: 1280, width: "100%", margin: "0 auto", scrollMarginTop: 80 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 28, letterSpacing: "0.01em", margin: 0, color: "var(--color-text)" }}>
            Catálogo
          </h2>
          <span style={{ fontSize: 14, color: "var(--color-text)", opacity: 0.6 }}>
            {filtered.length} producto{filtered.length === 1 ? "" : "s"}
          </span>
        </div>

        <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
          <span className={!category ? "tag tag-accent" : "tag tag-outline"} onClick={() => setCategory(null)}>
            Todos
          </span>
          {CATEGORIES.map((c) => (
            <span
              key={c}
              className={category === c ? "tag tag-accent" : "tag tag-outline"}
              onClick={() => setCategory(c)}
            >
              {c}
            </span>
          ))}
        </div>

        {category === "Ropa Deportiva" && (
          <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
            <span className={!gender ? "tag tag-accent" : "tag tag-outline"} onClick={() => setGender(null)}>
              Todos
            </span>
            <span className={gender === "Hombre" ? "tag tag-accent" : "tag tag-outline"} onClick={() => setGender("Hombre")}>
              Hombre
            </span>
            <span className={gender === "Mujer" ? "tag tag-accent" : "tag tag-outline"} onClick={() => setGender("Mujer")}>
              Mujer
            </span>
          </div>
        )}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "var(--space-4)" }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <ProductGrid products={filtered} />
        )}
      </div>

      {/* Reseñas */}
      <div
        className="section-glow"
        style={{
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-divider)",
          borderBottom: "1px solid var(--color-divider)",
          padding: "var(--space-6) var(--space-4)",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
            style={{ textAlign: "center", marginBottom: "var(--space-6)" }}
          >
            <span className="tag tag-accent">Clientes en Yopal, Casanare</span>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 28, margin: "8px 0 4px 0" }}>
              Lo que dicen quienes ya compraron
            </h2>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <Stars count={5} />
              <span style={{ fontSize: 14, opacity: 0.75 }}>
                {AVG_RATING} de 5 · {REVIEWS.length} reseñas de clientes reales
              </span>
            </div>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-4)" }}>
            {REVIEWS.map((rev, i) => (
              <motion.div
                key={rev.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: EASE }}
                className="card blueprint elev-sm review-card"
                style={{ padding: "var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-2)", background: "var(--color-bg)" }}
              >
                <i className="corner tl"></i>
                <i className="corner tr"></i>
                <i className="corner bl"></i>
                <i className="corner br"></i>
                <span style={{ fontFamily: "var(--font-heading)", fontSize: 36, lineHeight: 0.4, color: "var(--color-accent)", opacity: 0.45 }}>
                  "
                </span>
                <Stars count={rev.stars} />
                <p style={{ fontSize: 14, lineHeight: 1.55, opacity: 0.85, margin: 0, flex: 1 }}>{rev.text}</p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginTop: "auto",
                    paddingTop: "var(--space-3)",
                    borderTop: "1px solid var(--color-divider)",
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background: "var(--color-accent-100)",
                      color: "var(--color-accent-800)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--font-heading)",
                      fontSize: 13,
                    }}
                  >
                    {getInitials(rev.name)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontFamily: "var(--font-heading)" }}>{rev.name}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>Yopal, Casanare</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Ubicación */}
      <div
        className="split-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "var(--space-6) var(--space-4)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <span className="tag tag-outline">Punto de despacho</span>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: 26, margin: "8px 0" }}>
            Nos encontrás en Yopal, Casanare
          </h2>
          <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.6, marginBottom: "var(--space-4)" }}>
            Despachamos a todo Casanare y el resto de Colombia. Coordiná la entrega o el retiro por
            WhatsApp.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-4)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "var(--color-accent-100)",
                  color: "var(--color-accent-800)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MapPin size={16} />
              </span>
              <span style={{ fontSize: 14 }}>Yopal, Casanare, Colombia</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "var(--color-accent-100)",
                  color: "var(--color-accent-800)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageCircle size={16} />
              </span>
              <span style={{ fontSize: 14 }}>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </div>
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Yopal,+Casanare,+Colombia"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            Cómo llegar
          </a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="blueprint"
          style={{ position: "relative", border: "1px solid var(--color-divider)", aspectRatio: "16/10", overflow: "hidden", boxShadow: "var(--shadow-md)" }}
        >
          <i className="corner tl"></i>
          <i className="corner tr"></i>
          <i className="corner bl"></i>
          <i className="corner br"></i>
          <iframe
            title="Ubicación en Yopal, Casanare"
            src="https://www.google.com/maps?q=Yopal,+Casanare,+Colombia&output=embed"
            style={{ width: "100%", height: "100%", border: 0, filter: "grayscale(0.2) contrast(1.05)" }}
            loading="lazy"
          ></iframe>
        </motion.div>
      </div>
    </div>
  );
}
