// Browser-side cart + "Tu MoodBox" draft, persisted in localStorage.
// ponytail: cart lives per-browser; move to a DB table if carts must follow users across devices.
import { useSyncExternalStore } from "react";
import { MAX_BOX_ITEMS, type CartLine, type Letter } from "./pricing";

export type DraftItem = { slug: string; quantity: number };
export type Draft = { items: DraftItem[]; letter: Letter; editingId: string | null };
export type Toast = { id: number; title: string; detail: string };
type State = { cart: CartLine[]; draft: Draft; toast: Toast | null };

const KEY = "moodbox:v1";
const emptyDraft = (): Draft => ({ items: [], letter: { to: "", from: "", message: "" }, editingId: null });
const EMPTY: State = { cart: [], draft: emptyDraft(), toast: null };

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "{}");
      state = { ...EMPTY, cart: Array.isArray(saved.cart) ? saved.cart : [], draft: saved.draft ?? emptyDraft() };
    } catch { /* corrupted storage → start empty */ }
  }
  return state;
}

function set(update: (s: State) => Partial<State>) {
  state = { ...load(), ...update(load()) };
  try { localStorage.setItem(KEY, JSON.stringify({ cart: state.cart, draft: state.draft })); } catch { /* private mode */ }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { loaded = false; load(); listener(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}

export function useStore() {
  return useSyncExternalStore(subscribe, load, () => EMPTY);
}

const newId = () => Math.random().toString(36).slice(2, 10);
export const draftCount = (d: Draft) => d.items.reduce((n, i) => n + i.quantity, 0);
export const cartCount = (c: CartLine[]) => c.reduce((n, l) => n + l.quantity, 0);

type NewLine = { [K in CartLine["kind"]]: Omit<Extract<CartLine, { kind: K }>, "id"> }[CartLine["kind"]];

export const cart = {
  add(line: NewLine, toast: Omit<Toast, "id">) {
    set((s) => {
      // Same box/product again → bump quantity instead of a duplicate line.
      const same = "slug" in line && s.cart.find((l) => l.kind === line.kind && "slug" in l && l.slug === line.slug);
      const next = same
        ? s.cart.map((l) => (l === same ? { ...l, quantity: Math.min(20, l.quantity + line.quantity) } : l))
        : [...s.cart, { ...line, id: newId() } as CartLine];
      return { cart: next, toast: { ...toast, id: Date.now() } };
    });
  },
  setQuantity(id: string, quantity: number) {
    set((s) => ({ cart: s.cart.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, Math.min(20, quantity)) } : l)) }));
  },
  remove(id: string) {
    set((s) => ({ cart: s.cart.filter((l) => l.id !== id) }));
  },
  clear() {
    set(() => ({ cart: [] }));
  },
  dismissToast() {
    set(() => ({ toast: null }));
  },
};

export const draft = {
  toggle(slug: string) {
    set((s) => {
      const has = s.draft.items.some((i) => i.slug === slug);
      if (!has && draftCount(s.draft) >= MAX_BOX_ITEMS) return {};
      const items = has ? s.draft.items.filter((i) => i.slug !== slug) : [...s.draft.items, { slug, quantity: 1 }];
      return { draft: { ...s.draft, items } };
    });
  },
  setQuantity(slug: string, quantity: number) {
    set((s) => {
      const others = draftCount(s.draft) - (s.draft.items.find((i) => i.slug === slug)?.quantity ?? 0);
      const q = Math.max(1, Math.min(quantity, MAX_BOX_ITEMS - others));
      return { draft: { ...s.draft, items: s.draft.items.map((i) => (i.slug === slug ? { ...i, quantity: q } : i)) } };
    });
  },
  setLetter(letter: Partial<Letter>) {
    set((s) => ({ draft: { ...s.draft, letter: { ...s.draft.letter, ...letter } } }));
  },
  /** Start editing: from a predefined box's products or an existing cart line. */
  load(items: DraftItem[], letter?: Letter, editingId: string | null = null) {
    set(() => ({ draft: { items: items.slice(0, MAX_BOX_ITEMS), letter: letter ?? emptyDraft().letter, editingId } }));
  },
  /** Moves the draft into the cart (replacing the line being edited) and clears it. */
  commit(toast: Omit<Toast, "id">) {
    set((s) => {
      const hasLetter = s.draft.items.some((i) => i.slug === "carta");
      const line = { kind: "custom" as const, items: s.draft.items, letter: hasLetter ? s.draft.letter : undefined };
      const editing = s.cart.find((l) => l.id === s.draft.editingId);
      const next = editing
        ? s.cart.map((l) => (l === editing ? { ...line, id: l.id, quantity: l.quantity } : l))
        : [...s.cart, { ...line, id: newId(), quantity: 1 }];
      return { cart: next, draft: emptyDraft(), toast: { ...toast, id: Date.now() } };
    });
  },
};

const noop = () => () => {};
/** false during SSR/hydration, true once the browser store can be read. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
