import "server-only";
import { getMoodboxes, getProducts } from "./data";
import type { ViewCatalog } from "./cartView";

/** Minimal catalog data the client needs to display cart lines. */
export async function getViewCatalog(): Promise<ViewCatalog> {
  const [products, boxes] = await Promise.all([getProducts(true), getMoodboxes()]);
  return {
    products: products.map(({ slug, name, description, price, image, available, category }) => ({ slug, name, description, price, image, available, category })),
    boxes: boxes.map((b) => ({ slug: b.slug, number: b.number, name: b.name, price: b.price, items: b.items.map((i) => ({ slug: i.slug, label: i.label, image: i.image })) })),
  };
}
