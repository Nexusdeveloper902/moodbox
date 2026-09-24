// Recreates the schema and seeds products, MoodBoxes and a demo user.
// Usage: npm run db:setup   (DATABASE_FILE in .env → data/<file>, default moodbox.db)
import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import bcrypt from "bcryptjs";

const products = [
  // slug, name, description, category, price, available, in_catalog
  ["chocolate", "Chocolate", "Barra de cacao colombiano 70%", "dulce", 12000],
  ["gomitas", "Gomitas", "Ositos de frutas surtidos", "dulce", 8000],
  ["brownie", "Brownie", "De chocolate, hecho en casa", "dulce", 9000],
  ["te", "Té", "Manzanilla y lavanda", "bebida", 10000],
  ["chocolate-caliente", "Chocolate caliente", "Con malvaviscos", "bebida", 11000],
  ["bebida-fria", "Bebida fría", "Té helado de durazno", "bebida", 9000, false],
  ["pulsera", "Pulsera", "Cuentas de colores con dije", "detalle", 15000],
  ["llavero", "Llavero", "Cajita MoodBox sonriente", "detalle", 10000],
  ["accesorio", "Accesorio", "Gafas de sol de colores", "detalle", 18000],
  ["antifaz", "Antifaz", "Tela suave para descansar", "relajacion", 14000],
  ["vela", "Vela", "Aroma a lavanda, 20 horas", "relajacion", 16000],
  ["carta", "Carta", "Escrita a mano con tu mensaje", "mensaje", 5000],
  ["tarjeta", "Tarjeta", "Ilustrada, con sobre", "mensaje", 6000],
  ["dulce", "Dulce", "Caramelo artesanal de maracuyá", "dulce", 4000, true, false],
];

const moodboxes = [
  {
    slug: "dia-dificil", number: 1, name: "Día difícil", mood: "Para un mal día", price: 45000,
    tagline: "Tuve un día difícil",
    quote: "“Hoy fue difícil, pero aquí tienes un pequeño detalle para ti.”",
    summary: "Un abrazo en forma de caja para cuando el día pesa.",
    description: "Para esos días en que todo pesa un poco más. Un detalle dulce, unas palabras que animan y una pulsera para recordar que no estás sola ni solo.",
    items: [
      ["dulce", "Dulce", "Caramelo artesanal de maracuyá"],
      ["carta", "Carta motivadora", "Un mensaje para levantarte el ánimo"],
      ["pulsera", "Pulsera", "Cuentas de colores con dije de corazón"],
    ],
  },
  {
    slug: "necesito-relajarme", number: 2, name: "Necesito relajarme", mood: "Para desconectarte", price: 59000,
    tagline: "Necesito descansar",
    quote: "“Es momento de parar un rato.”",
    summary: "Una pausa solo para ti: té, vela y descanso sin prisa.",
    description: "Una pausa solo para ti: una taza de té caliente, una vela con aroma a lavanda y un antifaz suave para descansar sin prisa.",
    items: [
      ["te", "Té", "Manzanilla y lavanda"],
      ["antifaz", "Antifaz", "Suave y ligero"],
      ["vela", "Vela", "Aroma a lavanda"],
    ],
  },
  {
    slug: "quiero-sorprender", number: 3, name: "Quiero sorprender a alguien", mood: "Para regalar", price: 65000,
    tagline: "Quiero consentir a alguien",
    quote: "“Esto fue elegido especialmente para ti.”",
    summary: "Para esa persona especial: amigo, familia o pareja.",
    description: "Para tu mejor amiga, tu hermano, tu mamá, tu pareja o esa persona especial: chocolates, una carta y un accesorio para sacarle una sonrisa.",
    items: [
      ["chocolate", "Chocolates", "Barra de cacao colombiano y bombones"],
      ["carta", "Carta", "Escribe tu mensaje o usa el nuestro"],
      ["accesorio", "Accesorio", "Gafas de sol de colores"],
    ],
  },
];

const file = path.join(process.cwd(), "data", path.basename(process.env.DATABASE_FILE ?? "moodbox.db"));
mkdirSync(path.dirname(file), { recursive: true });
const db = new DatabaseSync(file);
db.exec("PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;");
db.exec(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));

const passwordHash = await bcrypt.hash("moodbox123", 12);

db.exec("BEGIN");
try {
  const productIds = {};
  const insertProduct = db.prepare(
    `INSERT INTO products (slug, name, description, category, price, image, available, in_catalog, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  for (const [i, [slug, name, description, category, price, available = true, inCatalog = true]] of products.entries()) {
    const { lastInsertRowid } = insertProduct.run(slug, name, description, category, price, `/moodbox/products/${slug}.svg`, available ? 1 : 0, inCatalog ? 1 : 0, i);
    productIds[slug] = Number(lastInsertRowid);
  }

  const boxIds = {};
  const insertBox = db.prepare(
    `INSERT INTO moodboxes (slug, number, name, mood, tagline, quote, summary, description, price, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertItem = db.prepare("INSERT INTO moodbox_items (moodbox_id, product_id, label, detail, sort) VALUES (?, ?, ?, ?, ?)");
  for (const b of moodboxes) {
    const { lastInsertRowid } = insertBox.run(b.slug, b.number, b.name, b.mood, b.tagline, b.quote, b.summary, b.description, b.price, `/moodbox/cajas/abierta-${b.slug}.svg`);
    boxIds[b.slug] = Number(lastInsertRowid);
    for (const [i, [slug, label, detail]] of b.items.entries()) insertItem.run(boxIds[b.slug], productIds[slug], label, detail, i);
  }

  // Demo account with two delivered orders, so the order history isn't empty.
  const { lastInsertRowid: userId } = db.prepare(
    `INSERT INTO users (name, email, password_hash, phone, address, city)
     VALUES ('Laura Gómez', 'laura@correo.com', ?, '300 123 4567', 'Calle 45 # 12-30, apto 502', 'Bogotá')`,
  ).run(passwordHash);
  const pastOrders = [
    [951, "quiero-sorprender", "2026-06-14T20:00:00.000Z"],
    [987, "necesito-relajarme", "2026-08-02T16:30:00.000Z"],
  ];
  for (const [id, slug, date] of pastOrders) {
    const box = moodboxes.find((b) => b.slug === slug);
    db.prepare(
      `INSERT INTO orders (id, user_id, total, status, name, email, phone, address, city, created_at)
       VALUES (?, ?, ?, 'entregado', 'Laura Gómez', 'laura@correo.com', '300 123 4567', 'Calle 45 # 12-30, apto 502', 'Bogotá', ?)`,
    ).run(id, userId, box.price, date);
    db.prepare(
      `INSERT INTO order_items (order_id, kind, moodbox_id, name, contents, quantity, unit_price)
       VALUES (?, 'moodbox', ?, ?, ?, 1, ?)`,
    ).run(id, boxIds[slug], box.name, JSON.stringify(box.items.map(([s, label]) => ({ slug: s, name: label, quantity: 1 }))), box.price);
  }
  // New orders get references like #MB-1024.
  db.prepare("UPDATE sqlite_sequence SET seq = 1023 WHERE name = 'orders'").run();

  db.exec("COMMIT");
  console.log(`Base de datos lista en ${path.relative(process.cwd(), file)}: 14 productos, 3 MoodBox, usuario demo laura@correo.com / moodbox123`);
} catch (err) {
  db.exec("ROLLBACK");
  throw err;
} finally {
  db.close();
}
