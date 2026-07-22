import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShoppingBag, Menu, X, Sun, Moon, User } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import CategoryBar from "./CategoryBar";

const STORE_NAME = "MERCADO CENTRAL";

export default function Navbar({ query, onQueryChange }) {
  const { count, toggleDrawer } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useCustomerAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const links = [
    { to: "/", label: "Inicio" },
    { to: "/cart", label: "Mi carrito" },
    isAuthenticated ? { to: "/cuenta", label: "Mi cuenta" } : { to: "/login", label: "Iniciar sesión" },
  ];

  return (
    <>
      <div
        style={{
          background: "var(--color-accent-900)",
          color: "var(--color-bg)",
          fontSize: 13,
          textAlign: "center",
          padding: "6px var(--space-4)",
          letterSpacing: "0.02em",
        }}
      >
        Envíos a toda Colombia · Pago contraentrega, transferencia o WhatsApp
      </div>

      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="nav"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          alignItems: "center",
          gap: "var(--space-4)",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-divider)",
        }}
      >
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18"></rect>
            <path d="M3 9h18M9 21V9"></path>
          </svg>
          <span
            className="nav-brand"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: 22,
              letterSpacing: "0.02em",
              color: "var(--color-text)",
              whiteSpace: "nowrap",
            }}
          >
            {STORE_NAME}
          </span>
        </Link>

        <nav className="nav-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? "active" : ""}
              style={{ fontSize: 14, opacity: 0.75 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {isHome && (
          <div className="nav-search">
            <Search
              size={16}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.55 }}
            />
            <input
              className="input"
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              style={{ width: "100%", paddingLeft: 36 }}
            />
          </div>
        )}

        <div style={{ flex: 1 }}></div>

        <button
          className="btn btn-icon"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Cambiar a modo día" : "Cambiar a modo noche"}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Link
          to={isAuthenticated ? "/cuenta" : "/login"}
          className="btn btn-icon"
          aria-label={isAuthenticated ? `Mi cuenta (${user.name})` : "Iniciar sesión"}
          title={isAuthenticated ? user.name : "Iniciar sesión"}
        >
          <User size={18} />
        </Link>

        <button className="btn btn-icon" onClick={toggleDrawer} style={{ position: "relative" }} aria-label="Carrito">
          <ShoppingBag size={20} />
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "var(--color-accent)",
                color: "var(--color-bg)",
                fontSize: 11,
                fontWeight: 700,
                minWidth: 18,
                height: 18,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 4px",
              }}
            >
              {count}
            </motion.span>
          )}
        </button>

        <button
          className="btn btn-icon nav-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </motion.header>

      <CategoryBar />

      <div className={`nav-mobile-panel${mobileOpen ? " open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? "active" : ""}
            style={{ fontSize: 15 }}
          >
            {link.label}
          </Link>
        ))}
        {isHome && (
          <div style={{ position: "relative" }}>
            <Search
              size={16}
              style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.55 }}
            />
            <input
              className="input"
              type="text"
              placeholder="Buscar productos..."
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              style={{ width: "100%", paddingLeft: 36 }}
            />
          </div>
        )}
        <button
          className="btn btn-secondary btn-block"
          onClick={toggleTheme}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          {theme === "dark" ? "Modo día" : "Modo noche"}
        </button>
      </div>
    </>
  );
}
