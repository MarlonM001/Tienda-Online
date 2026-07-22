import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import AuthLayout from "../components/layout/AuthLayout";

const EASE = [0.16, 1, 0.3, 1];

function IconField({ icon: Icon, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: EASE }}
      className="field"
    >
      {children[0]}
      <div style={{ position: "relative" }}>
        <Icon size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
        {children[1]}
      </div>
    </motion.div>
  );
}

export default function Register() {
  const { register } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/cuenta";
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.error || "No se pudo crear la cuenta");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Creá tu cuenta" subtitle="Registrate para agilizar tus próximas compras y ver el historial de tus pedidos.">
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", width: "100%" }}
      >
        <IconField icon={User} delay={0.05}>
          <label>Nombre completo</label>
          <input
            className="input"
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Juan Pérez"
            style={{ paddingLeft: 36 }}
          />
        </IconField>

        <IconField icon={Mail} delay={0.1}>
          <label>Correo electrónico</label>
          <input
            className="input"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="tu@correo.com"
            style={{ paddingLeft: 36 }}
          />
        </IconField>

        <IconField icon={Phone} delay={0.15}>
          <label>Teléfono (opcional)</label>
          <input
            className="input"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="300 123 4567"
            style={{ paddingLeft: 36 }}
          />
        </IconField>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2, ease: EASE }} className="field">
          <label>Contraseña</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
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

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25, ease: EASE }} className="field">
          <label>Confirmar contraseña</label>
          <div style={{ position: "relative" }}>
            <Lock size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.5 }} />
            <input
              className="input"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí tu contraseña"
              style={{ paddingLeft: 36 }}
            />
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
          type="submit"
          className="btn btn-primary btn-block"
          disabled={submitting}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          <UserPlus size={16} />
          {submitting ? "Creando cuenta..." : "Crear cuenta"}
        </motion.button>

        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{ fontSize: 13, textAlign: "center" }}
        >
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" state={location.state} style={{ color: "var(--color-accent-700)", fontWeight: 600 }}>
            Iniciá sesión
          </Link>
        </motion.span>
      </form>
    </AuthLayout>
  );
}
