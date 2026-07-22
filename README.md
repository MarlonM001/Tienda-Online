# Tienda Online — MERCADO CENTRAL

Tienda online de varias categorías (tecnología, moda, hogar, deportes, belleza, accesorios), sin
pasarela de pago: los pedidos se coordinan por WhatsApp, contraentrega o transferencia manual.
Incluye cuentas de cliente con historial de pedidos y un panel de administrador completo.

## Stack

- **Cliente**: React + Vite + Tailwind CSS + Framer Motion + React Router.
- **Servidor**: Express (ESM) + lowdb (JSON como base de datos) + JWT + bcryptjs.
- **PDF**: jsPDF + jspdf-autotable (reportes de ventas, generados en el navegador).

## Funcionalidades

### Tienda pública

- Catálogo con búsqueda, filtro por categoría y banners destacados por categoría.
- Carrito de compras (drawer lateral + página completa).
- Cuentas de cliente: registro, inicio de sesión, edición de perfil e historial de pedidos.
- Checkout con dos vías: pedido directo por WhatsApp, o formulario con pago contraentrega,
  transferencia o pago anticipado. Requiere estar registrado para completar la compra.
- Seguimiento visual del pedido (pedido recibido → preparando → en camino → entregado) y estado
  de pago (pendiente / aprobado) visible para el cliente.
- Modo día/noche, botón flotante de WhatsApp, reseñas, mapa de ubicación.

### Panel de administrador (`/admin`)

- **Resumen**: ingresos, pedidos pendientes, pagos por confirmar, stock bajo/agotado, clientes
  registrados y gráfico de ingresos de los últimos 7 días.
- **Productos**: alta, edición, baja, búsqueda y control de stock.
- **Pedidos**: cambio de estado de envío y de pago, búsqueda y filtros, eliminación de pedidos.
- **Clientes**: listado con historial de compras, opción de banear o eliminar una cuenta.
- **Reportes**: reporte de ventas por mes (ingresos aprobados, pendientes, cancelados, productos
  más vendidos) con exportación a PDF.

## Estructura

```
server/   API Express — datos en server/data/db.json (lowdb), auth admin + auth de clientes (JWT)
client/   React + Vite + Tailwind + Framer Motion
```

## Cómo correr en desarrollo

### 1. Servidor

```
cd server
npm install
copy .env.example .env
node scripts/generateHash.js "tu-password-admin"
```

Pegá el hash impreso en `ADMIN_PASSWORD_HASH` dentro de `server/.env`, y elegí un `ADMIN_USERNAME`
y un `JWT_SECRET` (cualquier string largo aleatorio).

```
npm run dev
```

Corre en `http://localhost:4000`.

### 2. Cliente

```
cd client
npm install
copy .env.example .env
npm run dev
```

Corre en `http://localhost:5173`. Editá `VITE_STORE_WHATSAPP_NUMBER` en `client/.env` con el
número de WhatsApp de la tienda (solo dígitos, con código de país, sin `+` ni espacios).

También podés correr ambos a la vez desde la raíz del proyecto con `npm run dev` (usa
`concurrently`), una vez instaladas las dependencias de `server/` y `client/`.

### 3. Admin

Entrá a `http://localhost:5173/admin/login` con el `ADMIN_USERNAME` y la contraseña en texto plano
que usaste para generar el hash.

## Variables de entorno

**`server/.env`**

| Variable | Descripción |
|---|---|
| `PORT` | Puerto del servidor (default `4000`). |
| `CLIENT_ORIGIN` | Origen permitido por CORS (URL del cliente). |
| `ADMIN_USERNAME` | Usuario del panel admin. |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt de la contraseña del admin (generado con el script). |
| `JWT_SECRET` | Clave para firmar los tokens (admin y clientes). |
| `JWT_EXPIRES_IN` | Duración del token de admin (ej. `8h`). |

**`client/.env`**

| Variable | Descripción |
|---|---|
| `VITE_API_ORIGIN` | URL base del servidor. |
| `VITE_STORE_WHATSAPP_NUMBER` | Número de WhatsApp de la tienda. |

> Ninguno de estos archivos `.env` se sube al repositorio (ver `.gitignore`).
