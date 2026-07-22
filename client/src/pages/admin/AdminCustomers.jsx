import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Search, Ban, ShieldCheck, Trash2 } from "lucide-react";
import { adminGetCustomers, adminBanCustomer, adminDeleteCustomer } from "../../api/customers";
import { formatCurrency } from "../../utils/formatCurrency";
import Spinner from "../../components/ui/Spinner";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    adminGetCustomers()
      .then(setCustomers)
      .catch(() => toast.error("No se pudieron cargar los clientes"));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = (customers || []).filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.includes(q)
  );

  const handleToggleBan = async (customer) => {
    const next = !customer.banned;
    try {
      await adminBanCustomer(customer.id, next);
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, banned: next } : c)));
      toast.success(next ? "Cliente baneado" : "Cliente reactivado");
    } catch {
      toast.error("No se pudo actualizar el cliente");
    }
  };

  const handleDelete = async (customer) => {
    if (!confirm(`¿Eliminar la cuenta de ${customer.name}? Esta acción no se puede deshacer.`)) return;
    try {
      await adminDeleteCustomer(customer.id);
      setCustomers((prev) => prev.filter((c) => c.id !== customer.id));
      toast.success("Cliente eliminado");
    } catch {
      toast.error("No se pudo eliminar el cliente");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Clientes</h1>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar cliente..."
            className="rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      </div>

      {customers === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {query ? "No hay clientes que coincidan con la búsqueda." : "Todavía no se ha registrado ningún cliente."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Registrado</th>
                <th className="px-4 py-3">Pedidos</th>
                <th className="px-4 py-3">Total comprado</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{c.name}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{c.email}</td>
                  <td className="px-4 py-3">{c.phone || "—"}</td>
                  <td className="px-4 py-3">
                    {new Date(c.createdAt).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">{c.orderCount}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(c.totalSpent)}</td>
                  <td className="px-4 py-3">
                    {c.banned ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-500/10 dark:text-red-400">
                        Baneado
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                        Activo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggleBan(c)}
                        title={c.banned ? "Reactivar cliente" : "Banear cliente"}
                        className={c.banned ? "text-neutral-500 hover:text-green-600" : "text-neutral-500 hover:text-amber-600"}
                      >
                        {c.banned ? <ShieldCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(c)}
                        title="Eliminar cliente"
                        className="text-neutral-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
