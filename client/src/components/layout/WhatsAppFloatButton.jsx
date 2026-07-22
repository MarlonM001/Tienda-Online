import { motion } from "framer-motion";
import WhatsAppIcon from "../icons/WhatsAppIcon";

const WHATSAPP_NUMBER = import.meta.env.VITE_STORE_WHATSAPP_NUMBER;

export default function WhatsAppFloatButton() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "var(--space-4)",
        right: "var(--space-4)",
        zIndex: 45,
        width: 52,
        height: 52,
      }}
    >
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0.55, scale: 1 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#25D366",
        }}
      />
      <motion.a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero más información sobre sus productos")}`}
        target="_blank"
        rel="noreferrer"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ filter: "brightness(1.08)" }}
        whileTap={{ scale: 0.94 }}
        aria-label="Escribinos por WhatsApp"
        title="Escribinos por WhatsApp"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "#25D366",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "var(--shadow-md)",
          textDecoration: "none",
        }}
      >
        <WhatsAppIcon size={24} />
      </motion.a>
    </div>
  );
}
