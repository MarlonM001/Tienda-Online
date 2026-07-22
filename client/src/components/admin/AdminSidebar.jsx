import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Package, ClipboardList, FileBarChart, Users, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import AmbientMusicButton from "./AmbientMusicButton";

const links = [
  { to: "/admin", label: "Resumen", icon: LayoutDashboard, end: true },
  { to: "/admin/productos", label: "Productos", icon: Package },
  { to: "/admin/pedidos", label: "Pedidos", icon: ClipboardList },
  { to: "/admin/clientes", label: "Clientes", icon: Users },
  { to: "/admin/reportes", label: "Reportes", icon: FileBarChart },
];

function NavLinks({ onNavigate }) {
  return (
    <nav className="flex-1 space-y-1">
      {links.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            clsx(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
              isActive
                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            )
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      {theme === "dark" ? "Modo día" : "Modo noche"}
    </button>
  );
}

export default function AdminSidebar() {
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between border-b border-neutral-200 p-4 md:hidden dark:border-neutral-800">
        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">Panel admin</span>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-neutral-600 dark:text-neutral-300"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-1 border-b border-neutral-200 p-4 md:hidden dark:border-neutral-800">
          <NavLinks onNavigate={() => setOpen(false)} />
          <div className="my-1 border-t border-neutral-100 dark:border-neutral-800" />
          <ThemeToggleButton />
          <AmbientMusicButton />
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      )}

      <aside className="hidden h-full w-56 shrink-0 flex-col border-r border-neutral-200 p-4 md:flex dark:border-neutral-800">
        <NavLinks />
        <div className="space-y-1 border-t border-neutral-100 pt-2 dark:border-neutral-800">
          <ThemeToggleButton />
          <AmbientMusicButton />
          <button
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
