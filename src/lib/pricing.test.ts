import { test } from "node:test";
import assert from "node:assert/strict";
import { priceCart, CartError, type CatalogProduct, type CatalogBox } from "./pricing.ts";

const p = (id: number, slug: string, price: number, extra: Partial<CatalogProduct> = {}): CatalogProduct =>
  ({ id, slug, name: slug, price, available: true, in_catalog: true, ...extra });
const products = [p(1, "gomitas", 8000), p(2, "vela", 16000), p(3, "carta", 5000), p(4, "bebida-fria", 9000, { available: false }), p(5, "dulce", 4000, { in_catalog: false })];
const boxes: CatalogBox[] = [{ id: 1, slug: "dia-dificil", name: "Día difícil", price: 45000, contents: [] }];

test("totals come from catalog prices, not from the client", () => {
  const { lines, total } = priceCart([
    { kind: "moodbox", slug: "dia-dificil", quantity: 2, price: 1 },
    { kind: "product", slug: "vela", quantity: 1 },
    { kind: "custom", quantity: 1, items: [{ slug: "gomitas", quantity: 2 }, { slug: "carta", quantity: 1 }], letter: { to: "Ana", from: "Leo", message: "¡Ánimo!" } },
  ], products, boxes);
  assert.equal(lines[2]!.unitPrice, 21000);
  assert.deepEqual(lines[2]!.letter, { to: "Ana", from: "Leo", message: "¡Ánimo!" });
  assert.equal(total, 90000 + 16000 + 21000);
});

test("letter is dropped when the box has no Carta", () => {
  const { lines } = priceCart([{ kind: "custom", quantity: 1, items: [{ slug: "vela", quantity: 1 }], letter: { to: "", from: "", message: "hola" } }], products, boxes);
  assert.equal(lines[0]!.letter, null);
});

test("rejects sold-out, hidden, oversized and malformed lines", () => {
  const bad = [
    [{ kind: "product", slug: "bebida-fria", quantity: 1 }],
    [{ kind: "product", slug: "dulce", quantity: 1 }],
    [{ kind: "custom", quantity: 1, items: [{ slug: "gomitas", quantity: 4 }, { slug: "vela", quantity: 3 }] }],
    [{ kind: "product", slug: "vela", quantity: 0 }],
    [{ kind: "product", slug: "vela", quantity: 1.5 }],
    [],
    "nope",
  ];
  for (const input of bad) assert.throws(() => priceCart(input, products, boxes), CartError);
});
