import clsx from "clsx";
import { STATUS_LABELS } from "../../constants/orderStatus";

const STYLES = {
  pendiente: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  confirmado: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  enviado: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400",
  entregado: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  cancelado: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", STYLES[status])}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}
