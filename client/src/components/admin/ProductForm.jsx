import { useState } from "react";
import { CATEGORIES, GENDERS } from "../../constants/categories";

const initialState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  gender: "Unisex",
  active: true,
};

export default function ProductForm({ initial, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initial || initialState);
  const [files, setFiles] = useState([]);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock", form.stock);
    formData.append("category", form.category);
    formData.append("gender", form.gender);
    formData.append("active", form.active);
    files.forEach((file) => formData.append("images", file));
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
    >
      <input
        required
        placeholder="Nombre"
        value={form.name}
        onChange={handleChange("name")}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />
      <textarea
        placeholder="Descripción"
        value={form.description}
        onChange={handleChange("description")}
        rows={2}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          type="number"
          min={0}
          placeholder="Precio"
          value={form.price}
          onChange={handleChange("price")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
        <input
          type="number"
          min={0}
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange("stock")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <select
          required
          value={form.category}
          onChange={handleChange("category")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          <option value="" disabled>
            Selecciona categoría
          </option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={form.gender}
          onChange={handleChange("gender")}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
        >
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setFiles(Array.from(e.target.files))}
        className="w-full text-sm text-neutral-600 dark:text-neutral-300"
      />
      <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
        <input
          type="checkbox"
          checked={form.active === true || form.active === "true"}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        Activo (visible en el catálogo)
      </label>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
