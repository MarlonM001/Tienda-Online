import { useEffect, useMemo, useState } from "react";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import { adminGetOrders } from "../../api/orders";
import { formatCurrency } from "../../utils/formatCurrency";
import { STATUS_LABELS, PAYMENT_STATUS_LABELS } from "../../constants/orderStatus";
import Spinner from "../../components/ui/Spinner";

const MONTH_NAMES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function currentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export default function AdminReports() {
  const [orders, setOrders] = useState(null);
  const [month, setMonth] = useState(currentMonthValue());

  useEffect(() => {
    adminGetOrders()
      .then(setOrders)
      .catch(() => toast.error("No se pudieron cargar los pedidos"));
  }, []);

  const monthOrders = useMemo(
    () => (orders || []).filter((o) => o.createdAt.slice(0, 7) === month),
    [orders, month]
  );

  const cancelledOrders = monthOrders.filter((o) => o.status === "cancelado");
  const activeOrders = monthOrders.filter((o) => o.status !== "cancelado");
  const approvedOrders = activeOrders.filter((o) => o.paymentStatus === "pagado");
  const pendingPaymentOrders = activeOrders.filter((o) => o.paymentStatus !== "pagado");

  const approvedRevenue = approvedOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingRevenue = pendingPaymentOrders.reduce((sum, o) => sum + o.total, 0);
  const cancelledTotal = cancelledOrders.reduce((sum, o) => sum + o.total, 0);

  // Todos los pedidos del mes (incluye cancelados) para que el reporte sea completo y no oculte nada.
  const lineItems = useMemo(
    () =>
      monthOrders
        .flatMap((o) =>
          o.items.map((item) => ({
            ...item,
            date: o.createdAt,
            orderId: o.id,
            customer: o.customer.name,
            status: o.status,
            paymentStatus: o.paymentStatus || "pendiente",
          }))
        )
        .sort((a, b) => a.date.localeCompare(b.date)),
    [monthOrders]
  );

  const topProducts = useMemo(() => {
    const map = new Map();
    for (const item of lineItems) {
      if (item.status === "cancelado") continue;
      const prev = map.get(item.name) || { name: item.name, quantity: 0, revenue: 0 };
      prev.quantity += item.quantity;
      prev.revenue += item.subtotal;
      map.set(item.name, prev);
    }
    return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  }, [lineItems]);

  const [year, monthNum] = month.split("-");
  const monthLabel = `${MONTH_NAMES[Number(monthNum) - 1]} de ${year}`;

  const handleDownload = () => {
    if (lineItems.length === 0) {
      toast.error("No hay pedidos registrados ese mes");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("MERCADO CENTRAL", 14, 18);
    doc.setFontSize(11);
    doc.text(`Reporte de ventas — ${monthLabel}`, 14, 26);
    doc.setFontSize(9);
    doc.text(
      [
        `Ingresos aprobados: ${formatCurrency(approvedRevenue)} (${approvedOrders.length} pedidos)`,
        `Pendientes de pago: ${formatCurrency(pendingRevenue)} (${pendingPaymentOrders.length} pedidos)`,
        `Cancelados: ${formatCurrency(cancelledTotal)} (${cancelledOrders.length} pedidos) — no se contabilizan como ingreso`,
      ],
      14,
      33
    );

    autoTable(doc, {
      startY: 52,
      head: [["Fecha", "Pedido", "Cliente", "Producto", "Cant.", "Subtotal", "Estado", "Pago"]],
      body: lineItems.map((item) => [
        new Date(item.date).toLocaleDateString("es-CO"),
        "#" + item.orderId.slice(-6).toUpperCase(),
        item.customer,
        item.name,
        item.quantity,
        formatCurrency(item.subtotal),
        STATUS_LABELS[item.status] || item.status,
        PAYMENT_STATUS_LABELS[item.paymentStatus] || item.paymentStatus,
      ]),
      styles: { fontSize: 7.5 },
      headStyles: { fillColor: [37, 99, 235] },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index === 6) {
          const row = lineItems[data.row.index];
          if (row?.status === "cancelado") data.cell.styles.textColor = [185, 28, 28];
        }
        if (data.section === "body" && data.column.index === 7) {
          const row = lineItems[data.row.index];
          if (row?.paymentStatus === "pagado") data.cell.styles.textColor = [21, 128, 61];
        }
      },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.text(`Ingresos aprobados del mes: ${formatCurrency(approvedRevenue)}`, 14, finalY);

    doc.save(`ventas-${month}.pdf`);
  };

  if (!orders) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Reportes de ventas</h1>
        <div className="flex items-center gap-3">
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm bg-white text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Ingresos aprobados</p>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(approvedRevenue)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{approvedOrders.length} pedidos pagados</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Pendientes de pago</p>
          <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
            {formatCurrency(pendingRevenue)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{pendingPaymentOrders.length} pedidos por confirmar</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Cancelados</p>
          <p className="mt-2 text-3xl font-bold text-neutral-400 dark:text-neutral-500">
            {formatCurrency(cancelledTotal)}
          </p>
          <p className="mt-1 text-xs text-neutral-400">{cancelledOrders.length} pedidos (no cuentan como ingreso)</p>
        </div>
      </div>

      {topProducts.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">Más vendidos</h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Cantidad</th>
                  <th className="px-4 py-3">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.name} className="border-t border-neutral-100 dark:border-neutral-800">
                    <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{p.name}</td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3">{formatCurrency(p.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h2 className="mb-3 text-sm font-semibold text-neutral-500 dark:text-neutral-400">Detalle de pedidos del mes</h2>
      {lineItems.length === 0 ? (
        <p className="text-neutral-500 dark:text-neutral-400">No hay pedidos registrados en {monthLabel}.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-400">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Pedido</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Cant.</th>
                <th className="px-4 py-3">Subtotal</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Pago</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, i) => (
                <tr key={i} className="border-t border-neutral-100 dark:border-neutral-800">
                  <td className="px-4 py-3">{new Date(item.date).toLocaleDateString("es-CO")}</td>
                  <td className="px-4 py-3">#{item.orderId.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3">{item.customer}</td>
                  <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{item.name}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{formatCurrency(item.subtotal)}</td>
                  <td className="px-4 py-3">
                    <span className={item.status === "cancelado" ? "text-red-600 dark:text-red-400" : ""}>
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        item.paymentStatus === "pagado"
                          ? "text-green-600 dark:text-green-400"
                          : "text-amber-600 dark:text-amber-400"
                      }
                    >
                      {PAYMENT_STATUS_LABELS[item.paymentStatus] || item.paymentStatus}
                    </span>
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
