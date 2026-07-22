import { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

export default function RevenueChart({ days }) {
  const [hovered, setHovered] = useState(null);
  const max = Math.max(...days.map((d) => d.revenue), 1);

  return (
    <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
      <p className="mb-4 text-sm text-neutral-500 dark:text-neutral-400">Ingresos de los últimos 7 días</p>
      <div className="flex h-40 items-end gap-3">
        {days.map((d, i) => (
          <div
            key={d.label}
            className="relative flex flex-1 flex-col items-center justify-end gap-2"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {hovered === i && (
              <div className="absolute -top-9 z-10 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-white shadow-lg dark:bg-neutral-100 dark:text-neutral-900">
                {formatCurrency(d.revenue)}
              </div>
            )}
            <div
              className="w-full rounded-t-md bg-blue-500 transition-all dark:bg-blue-400"
              style={{
                height: `${Math.max((d.revenue / max) * 100, d.revenue > 0 ? 4 : 1)}%`,
                opacity: hovered === null || hovered === i ? 1 : 0.5,
              }}
            />
            <span className="text-xs text-neutral-400">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
