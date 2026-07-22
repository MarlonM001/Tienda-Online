import clsx from "clsx";
import { PAYMENT_STATUS_LABELS } from "../../constants/orderStatus";

const STYLES = {
  pendiente: "bg-neutral-100 text-neutral-600 dark:bg-neutral-500/10 dark:text-neutral-400",
  pagado: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
};

export default function PaymentStatusBadge({ status }) {
  return (
    <span className={clsx("rounded-full px-3 py-1 text-xs font-medium", STYLES[status])}>
      {PAYMENT_STATUS_LABELS[status] || status}
    </span>
  );
}
