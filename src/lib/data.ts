import "server-only";
import { cache } from "react";
import { db } from "./db";
import type { CatalogBox, CatalogProduct } from "./pricing";

export type Category = "dulce" | "bebida" | "detalle" | "relajacion" | "mensaje";

export type Product = {
  id: number; slug: string; name: string; description: string; category: Category;
  price: number; image: string; available: boolean; in_catalog: boolean;
};

export type BoxItem = { slug: string; label: string; detail: string; image: string; in_catalog: boolean };

export type MoodBox = {
  id: number; slug: string; number: number; name: string; mood: string; tagline: string; quote: string;
  summary: string; description: string; price: number; image: string; items: BoxItem[];
};

export type OrderStatus = "confirmado" | "en_camino" | "entregado";

export type OrderItem = {
  id: number; kind: "moodbox" | "product" | "custom"; name: string; quantity: number; unit_price: number;
  contents: { slug: string; name: string; quantity: number }[];
  custom_message: string | null; letter_to: string | null; letter_from: string | null;
  moodbox_slug: string | null; moodbox_number: number | null; product_slug: string | null;
};

export type Order = {
  id: number; total: number; status: OrderStatus; name: string; email: string; phone: string;
  address: string; city: string; notes: string | null; created_at: string; items: OrderItem[];
};

type Row = Record<string, unknown>;
const rows = (sql: string, ...params: (string | number)[]) => db.prepare(sql).all(...params) as Row[];

export const getMoodboxes = cache(async (): Promise<MoodBox[]> =>
  rows(`
    SELECT m.*, (
      SELECT json_group_array(json_object(
        'slug', p.slug, 'label', i.label, 'detail', i.detail, 'image', p.image, 'in_catalog', json(iif(p.in_catalog, 'true', 'false'))
      )) FROM (SELECT * FROM moodbox_items WHERE moodbox_id = m.id ORDER BY sort) i JOIN products p ON p.id = i.product_id
    ) AS items
    FROM moodboxes m ORDER BY m.number`,
  ).map((r) => ({ ...r, items: JSON.parse(r.items as string) }) as MoodBox));

export async function getMoodbox(slug: string) {
  return (await getMoodboxes()).find((m) => m.slug === slug) ?? null;
}

/** Sellable catalog (the 13 products); `all` includes box-only items like Dulce. */
export const getProducts = cache(async (all = false): Promise<Product[]> =>
  rows(
    `SELECT id, slug, name, description, category, price, image, available, in_catalog FROM products
     ${all ? "" : "WHERE in_catalog = 1"} ORDER BY sort`,
  ).map((r) => ({ ...r, available: r.available === 1, in_catalog: r.in_catalog === 1 }) as Product));

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getPricingCatalog(): Promise<{ products: CatalogProduct[]; boxes: CatalogBox[] }> {
  const [products, boxes] = await Promise.all([getProducts(true), getMoodboxes()]);
  return {
    products,
    boxes: boxes.map((b) => ({ id: b.id, slug: b.slug, name: b.name, price: b.price, contents: b.items.map((i) => ({ slug: i.slug, name: i.label })) })),
  };
}

const ORDER_SELECT = `
  SELECT o.*, (
    SELECT json_group_array(json_object(
      'id', i.id, 'kind', i.kind, 'name', i.name, 'quantity', i.quantity, 'unit_price', i.unit_price,
      'contents', json(i.contents), 'custom_message', i.custom_message, 'letter_to', i.letter_to, 'letter_from', i.letter_from,
      'moodbox_slug', m.slug, 'moodbox_number', m.number, 'product_slug', p.slug
    )) FROM (SELECT * FROM order_items WHERE order_id = o.id ORDER BY id) i
    LEFT JOIN moodboxes m ON m.id = i.moodbox_id LEFT JOIN products p ON p.id = i.product_id
  ) AS items
  FROM orders o`;

const toOrder = (r: Row) => ({ ...r, items: JSON.parse(r.items as string) }) as Order;

export async function getOrders(userId: number): Promise<Order[]> {
  return rows(`${ORDER_SELECT} WHERE o.user_id = ? ORDER BY o.created_at DESC`, userId).map(toOrder);
}

/** Scoped to the owner: another user's order id returns null. */
export async function getOrder(id: number, userId: number): Promise<Order | null> {
  if (!Number.isInteger(id) || id < 1) return null;
  const [r] = rows(`${ORDER_SELECT} WHERE o.id = ? AND o.user_id = ?`, id, userId);
  return r ? toOrder(r) : null;
}
