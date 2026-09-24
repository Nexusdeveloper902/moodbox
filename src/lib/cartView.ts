// Turns stored cart lines into display data using catalog data from the server.
import type { CartLine } from "./pricing";
import { BOX_THEMES, CUSTOM_BOX_ART, boxLabel } from "./theme";

export type ViewProduct = { slug: string; name: string; description: string; price: number; image: string; available: boolean; category: string };
export type ViewBox = { slug: string; number: number; name: string; price: number; items: { slug: string; label: string; image: string }[] };
export type ViewCatalog = { products: ViewProduct[]; boxes: ViewBox[] };

export type LineView = {
  kicker: string; name: string; contents: string; image: string; tile: string;
  unitPrice: number; href: string | null; icons: string[]; problem: string | null;
};

export function describeLine(line: CartLine, { products, boxes }: ViewCatalog): LineView | null {
  const p = (slug: string) => products.find((x) => x.slug === slug);
  if (line.kind === "moodbox") {
    const b = boxes.find((x) => x.slug === line.slug);
    if (!b) return null;
    return { kicker: boxLabel(b.number), name: b.name, contents: b.items.map((i) => i.label).join(" · "), image: BOX_THEMES[b.slug]!.closed,
      tile: BOX_THEMES[b.slug]!.scene, unitPrice: b.price, href: `/moodbox/${b.slug}`, icons: b.items.map((i) => i.image), problem: null };
  }
  if (line.kind === "product") {
    const x = p(line.slug);
    if (!x) return null;
    return { kicker: "Producto", name: x.name, contents: x.description, image: x.image, tile: "#f7f4ef", unitPrice: x.price,
      href: `/productos/${x.slug}`, icons: [], problem: x.available ? null : `${x.name} está agotado.` };
  }
  const items = line.items.map((i) => ({ ...i, product: p(i.slug) })).filter((i) => i.product);
  const soldOut = items.find((i) => !i.product!.available);
  return {
    kicker: "Caja personalizada", name: "Tu MoodBox",
    contents: items.map((i) => `${i.product!.name}${i.quantity > 1 ? ` ×${i.quantity}` : ""}`).join(" · "),
    image: CUSTOM_BOX_ART, tile: "#f3ece2", href: null, icons: items.map((i) => i.product!.image),
    unitPrice: items.reduce((s, i) => s + i.product!.price * i.quantity, 0),
    problem: soldOut ? `${soldOut.product!.name} está agotado. Edita tu caja para continuar.` : null,
  };
}
