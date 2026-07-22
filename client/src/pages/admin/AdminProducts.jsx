import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  adminGetProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
} from "../../api/products";
import { formatCurrency } from "../../utils/formatCurrency";
import ProductForm from "../../components/admin/ProductForm";
import Spinner from "../../components/ui/Spinner";

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = () => adminGetProducts().then(setProducts);

  useEffect(() => {
    load();
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = (products || []).filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );

  const handleCreate = async (formData) => {
    setSubmitting(true);
    try {
      await adminCreateProduct(formData);
      toast.success("Producto creado");
      setCreating(false);
      load();
    } catch {
      toast.error("No se pudo crear el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSubmitting(true);
    try {
      await adminUpdateProduct(editing.id, formData);
      toast.success("Producto actualizado");
      setEditing(null);
      load();
    } catch {
      toast.error("No se pudo actualizar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await adminDeleteProduct(id);
      toast.success("Producto eliminado");
      load();
    } catch {
      toast.error("No se pudo eliminar el producto");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Productos</h1>
        {!creating && !editing && (
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar producto..."
                className="rounded-lg border border-neutral-300 py-2 pl-9 pr-3 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
            </div>
            <button
              onClick={() => setCreating(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Nuevo producto
            </button>
          </div>
        )}
      </div>

      {creating && (
        <div className="mb-6">
          <ProductForm
            onSubmit={handleCreate}
            onCancel={() => setCreating(false)}
            submitting={submitting}
          />
        </div>
      )}

      {editing && (
        <div className="mb-6">
          <ProductForm
            initial={editing}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
            submitting={submitting}
          />
        </div>
      )}

      {products === null ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">
          {query ? "No hay productos que coincidan con la búsqueda." : "Todavía no hay productos."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{p.name}</td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400">{p.category}</td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.stock === 0
                          ? "font-medium text-red-600 dark:text-red-400"
                          : p.stock <= 5
                          ? "font-medium text-amber-600 dark:text-amber-400"
                          : ""
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {p.active ? (
                      <span className="text-green-600">Activo</span>
                    ) : (
                      <span className="text-neutral-400">Oculto</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditing(p)}
                        className="text-neutral-500 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
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
