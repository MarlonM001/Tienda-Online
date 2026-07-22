import { formatCurrency } from "./formatCurrency";

export function buildWhatsAppLink(cart, customer, total) {
  const phone = import.meta.env.VITE_STORE_WHATSAPP_NUMBER;

  const lines = [
    "*Nuevo pedido*",
    "",
    ...cart.map(
      (item) => `${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`
    ),
    "",
    `Total: ${formatCurrency(total)}`,
    "",
    `Cliente: ${customer.name}`,
    `Teléfono: ${customer.phone}`,
    `Dirección: ${customer.address}`,
    customer.notes ? `Notas: ${customer.notes}` : null,
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${phone}?text=${text}`;
}
