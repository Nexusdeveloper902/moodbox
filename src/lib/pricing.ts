// Cart lines as stored in the browser, and the server-side pricing that
// turns them into order items. Prices always come from the catalog, never
// from the client.

export const MAX_BOX_ITEMS = 6;
export const MAX_LINE_QTY = 20;
export const MAX_MESSAGE = 300;

export type Letter = { to: string; from: string; message: string };

export type CartLine =
  | { id: string; kind: "moodbox"; slug: string; quantity: number }
  | { id: string; kind: "product"; slug: string; quantity: number }
  | { id: string; kind: "custom"; items: { slug: string; quantity: number }[]; letter?: Letter; quantity: number };

export type CatalogProduct = { id: number; slug: string; name: string; price: number; available: boolean; in_catalog: boolean };
export type CatalogBox = { id: number; slug: string; name: string; price: number; contents: { slug: string; name: string }[] };

export type PricedLine = {
  kind: CartLine["kind"];
  moodboxId: number | null;
  productId: number | null;
  name: string;
  contents: { slug: string; name: string; quantity: number }[];
  quantity: number;
  unitPrice: number;
  letter: Letter | null;
};

export class CartError extends Error {}

const isQty = (n: unknown, max: number): n is number => Number.isInteger(n) && (n as number) >= 1 && (n as number) <= max;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function boxTotal(items: { slug: string; quantity: number }[], prices: Map<string, number>) {
  return items.reduce((sum, i) => sum + (prices.get(i.slug) ?? 0) * i.quantity, 0);
}

export function priceCart(input: unknown, products: CatalogProduct[], boxes: CatalogBox[]) {
  if (!Array.isArray(input) || input.length === 0) throw new CartError("Tu carrito está vacío.");
  if (input.length > 30) throw new CartError("Tu carrito tiene demasiados productos.");

  const bySlug = new Map(products.map((p) => [p.slug, p]));
  const sellable = (slug: unknown) => {
    const p = typeof slug === "string" ? bySlug.get(slug) : undefined;
    if (!p || !p.in_catalog) throw new CartError("Uno de los productos ya no existe.");
    if (!p.available) throw new CartError(`${p.name} está agotado. Quítalo para continuar.`);
    return p;
  };

  const lines: PricedLine[] = input.map((raw): PricedLine => {
    const line = raw as Record<string, unknown>;
    if (!isQty(line?.quantity, MAX_LINE_QTY)) throw new CartError("Revisa las cantidades de tu carrito.");
    const quantity = line.quantity;

    if (line.kind === "moodbox") {
      const box = boxes.find((b) => b.slug === line.slug);
      if (!box) throw new CartError("Una de las MoodBox ya no existe.");
      return { kind: "moodbox", moodboxId: box.id, productId: null, name: box.name, quantity, unitPrice: box.price, letter: null,
        contents: box.contents.map((c) => ({ ...c, quantity: 1 })) };
    }

    if (line.kind === "product") {
      const p = sellable(line.slug);
      return { kind: "product", moodboxId: null, productId: p.id, name: p.name, quantity, unitPrice: p.price, letter: null, contents: [] };
    }

    if (line.kind === "custom") {
      if (!Array.isArray(line.items) || line.items.length === 0) throw new CartError("Tu MoodBox personalizada está vacía.");
      const merged = new Map<string, number>();
      for (const it of line.items as { slug?: unknown; quantity?: unknown }[]) {
        const p = sellable(it?.slug);
        if (!isQty(it?.quantity, MAX_BOX_ITEMS)) throw new CartError("Revisa las cantidades de tu MoodBox.");
        merged.set(p.slug, (merged.get(p.slug) ?? 0) + (it.quantity as number));
      }
      const count = [...merged.values()].reduce((a, b) => a + b, 0);
      if (count > MAX_BOX_ITEMS) throw new CartError(`Tu MoodBox tiene espacio para ${MAX_BOX_ITEMS} productos.`);

      const contents = [...merged].map(([slug, q]) => ({ slug, name: bySlug.get(slug)!.name, quantity: q }));
      const prices = new Map(products.map((p) => [p.slug, p.price]));
      const l = line.letter as Record<string, unknown> | undefined;
      const letter = merged.has("carta") && l
        ? { to: str(l.to, 60), from: str(l.from, 60), message: str(l.message, MAX_MESSAGE) }
        : null;
      return { kind: "custom", moodboxId: null, productId: null, name: "Tu MoodBox", quantity, letter, contents,
        unitPrice: boxTotal(contents, prices) };
    }

    throw new CartError("Tu carrito tiene un producto no válido.");
  });

  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  return { lines, total };
}
