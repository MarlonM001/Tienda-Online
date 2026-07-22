import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "db.json");

const defaultData = { products: [], orders: [], users: [] };

const adapter = new JSONFile(file);
const db = new Low(adapter, defaultData);

const SEED_PRODUCTS = [
  { name: "Audífonos Bluetooth Pro", category: "Tecnología", price: 189000, stock: 14, description: "Audífonos inalámbricos con cancelación de ruido activa y hasta 30 horas de batería." },
  { name: "Parlante Portátil Sonic", category: "Tecnología", price: 149000, stock: 9, description: "Parlante resistente al agua con sonido envolvente y conexión Bluetooth 5.0." },
  { name: "Smartwatch Fit X2", category: "Tecnología", price: 349000, stock: 6, description: "Reloj inteligente con monitoreo de ritmo cardíaco, GPS y notificaciones." },
  { name: "Cargador Inalámbrico Rápido", category: "Tecnología", price: 79000, stock: 0, description: "Base de carga rápida compatible con la mayoría de smartphones." },
  { name: "Chaqueta Impermeable Urban", category: "Moda", price: 219000, stock: 11, description: "Chaqueta ligera e impermeable, ideal para el día a día en la ciudad." },
  { name: "Camiseta Oversize Básica", category: "Moda", price: 69000, stock: 25, description: "Camiseta de algodón 100% con corte oversize, disponible en varios colores." },
  { name: "Jean Slim Fit Azul", category: "Moda", price: 129000, stock: 17, description: "Jean de corte slim fit, tela elástica y acabado clásico azul." },
  { name: "Gorra Snapback Classic", category: "Moda", price: 59000, stock: 20, description: "Gorra ajustable con bordado frontal y visera plana." },
  { name: "Set de Sábanas Premium", category: "Hogar", price: 159000, stock: 8, description: "Juego de sábanas de microfibra suave, incluye fundas de almohada." },
  { name: "Lámpara de Mesa LED", category: "Hogar", price: 99000, stock: 13, description: "Lámpara LED regulable con tres tonos de luz y base de madera." },
  { name: "Cafetera Prensa Francesa", category: "Hogar", price: 139000, stock: 10, description: "Prensa francesa de vidrio borosilicato con estructura de acero inoxidable." },
  { name: "Organizador Modular 6 Compartimentos", category: "Hogar", price: 89000, stock: 0, description: "Organizador apilable ideal para closet, cocina o escritorio." },
  { name: "Balón de Fútbol Profesional", category: "Deportes", price: 119000, stock: 22, description: "Balón oficial N°5, costura termosellada y superficie antideslizante." },
  { name: "Mancuernas Ajustables 10kg", category: "Deportes", price: 259000, stock: 7, description: "Par de mancuernas ajustables de 2 a 10kg, ideales para entrenar en casa." },
  { name: "Mat de Yoga Antideslizante", category: "Deportes", price: 69000, stock: 30, description: "Mat de 6mm de espesor con superficie antideslizante en ambas caras." },
  { name: "Bicicleta Urbana Rodado 26", category: "Deportes", price: 890000, stock: 4, description: "Bicicleta urbana liviana, frenos de disco y cambios Shimano de 21 velocidades." },
  { name: "Kit de Skincare Facial", category: "Belleza", price: 129000, stock: 16, description: "Kit de limpieza, tónico e hidratante para todo tipo de piel." },
  { name: "Secador de Cabello Iónico", category: "Belleza", price: 169000, stock: 9, description: "Secador con tecnología iónica que reduce el frizz y protege el cabello." },
  { name: "Set de Brochas de Maquillaje", category: "Belleza", price: 79000, stock: 19, description: "Set de 12 brochas profesionales con estuche de viaje incluido." },
  { name: "Perfume Amber Wood 100ml", category: "Belleza", price: 219000, stock: 12, description: "Fragancia amaderada de larga duración, notas de ámbar y vainilla." },
  { name: "Billetera de Cuero Genuino", category: "Accesorios", price: 89000, stock: 15, description: "Billetera de cuero genuino con múltiples compartimentos para tarjetas." },
  { name: "Mochila Antirrobo Urban", category: "Accesorios", price: 179000, stock: 10, description: "Mochila con puerto USB, cierres ocultos y compartimento para portátil." },
  { name: "Gafas de Sol Polarizadas", category: "Accesorios", price: 99000, stock: 0, description: "Gafas con protección UV400 y lentes polarizados antirreflejo." },
  { name: "Cinturón Reversible Cuero", category: "Accesorios", price: 69000, stock: 21, description: "Cinturón reversible negro/café con hebilla giratoria." },
];

export async function initDb() {
  await db.read();
  db.data ||= structuredClone(defaultData);
  db.data.users ||= [];

  let needsWrite = false;
  for (const order of db.data.orders) {
    if (!order.paymentStatus) {
      order.paymentStatus = "pendiente";
      needsWrite = true;
    }
    if (order.userId === undefined) {
      order.userId = null;
      needsWrite = true;
    }
  }
  if (needsWrite) await db.write();

  if (db.data.products.length === 0) {
    const now = new Date().toISOString();
    db.data.products = SEED_PRODUCTS.map((p, i) => ({
      id: crypto.randomUUID(),
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      category: p.category,
      images: [`https://picsum.photos/seed/tienda-${i}/500/500`],
      active: true,
      createdAt: now,
      updatedAt: now,
    }));
    await db.write();
  }

  return db;
}

export default db;
