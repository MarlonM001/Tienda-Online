import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import AuthLayout from "../components/layout/AuthLayout";

const EASE = [0.16, 1, 0.3, 1];

export default function Login() {
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/cuenta";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "Correo o contraseña incorrectos");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de nuevo"
      subtitle={
        redirectTo === "/checkout"
          ? "Iniciá sesión para completar tu compra."
          : "Accedé a tu cuenta para ver el historial de tus pedidos y comprar más rápido."
      }
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%" }}
      >
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05, ease: EASE }} className="field">
          <label>Correo electrónico</label>
          <div style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              style={{ paddingLeft: 36 }}
            />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12, ease: EASE }} className="field">
          <label>Contraseña</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ paddingLeft: 36, paddingRight: 36 }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", opacity: 0.55, display: "flex" }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.19, ease: EASE }}
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <LogIn size={16} />
          {submitting ? "Ingresando..." : "Iniciar sesión"}
        </motion.button>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          style={{ fontSize: 13, textAlign: "center" }}
        >
          ¿No tenés cuenta?{" "}
          <Link to="/registro" state={location.state} style={{ color: "var(--color-accent-700)", fontWeight: 600 }}>
            Registrate
          </Link>
        </motion.span>
      </form>
    </AuthLayout>
  );
}
