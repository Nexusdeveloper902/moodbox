"use server";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { db, transaction } from "@/lib/db";
import { getPricingCatalog } from "@/lib/data";
import { CartError, priceCart } from "@/lib/pricing";

export type FormState = { errors?: Record<string, string>; message?: string; values?: Record<string, string>; orderId?: number };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const field = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
/** Only same-site relative paths, so ?next= can't redirect off-site. */
const safeNext = (v: string) => (v.startsWith("/") && !v.startsWith("//") ? v : "/cuenta");
const emailError = (email: string) =>
  !email ? "Escribe tu correo." : EMAIL.test(email) ? undefined : "Revisa tu correo: parece que falta “.com” o “.co”.";

export async function register(_: FormState, fd: FormData): Promise<FormState> {
  const name = field(fd, "name");
  const email = field(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const confirm = String(fd.get("confirm") ?? "");
  const values = { name, email };

  const errors: Record<string, string> = {};
  if (name.length < 2 || name.length > 80) errors.name = "Escribe tu nombre.";
  const e = emailError(email); if (e) errors.email = e;
  if (password.length < 8) errors.password = "Usa al menos 8 caracteres.";
  else if (password.length > 72) errors.password = "Usa máximo 72 caracteres.";
  if (password !== confirm) errors.confirm = "Las contraseñas no coinciden. Revísalas de nuevo.";
  if (!fd.get("terms")) errors.terms = "Acepta los términos para crear tu cuenta.";
  if (Object.keys(errors).length) return { errors, values };

  const hash = await bcrypt.hash(password, 12);
  const created = db.prepare(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?) ON CONFLICT (email) DO NOTHING RETURNING id",
  ).get(name, email, hash) as { id: number } | undefined;
  if (!created) return { errors: { email: "Ya existe una cuenta con este correo. ¿Quieres iniciar sesión?" }, values };

  await createSession(created.id);
  redirect(safeNext(field(fd, "next")));
}

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  const email = field(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  const values = { email };
  const e = emailError(email);
  if (e) return { errors: { email: e }, values };
  if (!password) return { errors: { password: "Escribe tu contraseña." }, values };

  const found = db.prepare("SELECT id, password_hash FROM users WHERE email = ?").get(email) as { id: number; password_hash: string } | undefined;
  // Same message whether the email or the password is wrong.
  if (!found || !(await bcrypt.compare(password, found.password_hash))) {
    return { message: "No encontramos una cuenta con esos datos. Inténtalo de nuevo.", values };
  }
  await createSession(found.id);
  redirect(safeNext(field(fd, "next")));
}

export async function logout() {
  await destroySession();
  redirect("/");
}

export async function placeOrder(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { message: "Tu sesión expiró. Inicia sesión de nuevo para finalizar la compra." };

  const contact = {
    name: field(fd, "name").slice(0, 80), phone: field(fd, "phone").slice(0, 30), email: field(fd, "email").toLowerCase().slice(0, 120),
    address: field(fd, "address").slice(0, 160), city: field(fd, "city").slice(0, 60), notes: field(fd, "notes").slice(0, 200),
  };
  const errors: Record<string, string> = {};
  if (contact.name.length < 2) errors.name = "Escribe tu nombre.";
  if (contact.phone.replace(/\D/g, "").length < 7) errors.phone = "Escribe un teléfono de contacto.";
  const e = emailError(contact.email); if (e) errors.email = e;
  if (contact.address.length < 5) errors.address = "Escribe la dirección de entrega.";
  if (contact.city.length < 2) errors.city = "Escribe la ciudad.";
  if (Object.keys(errors).length) return { errors, values: contact };

  let priced;
  try {
    const { products, boxes } = await getPricingCatalog();
    priced = priceCart(JSON.parse(String(fd.get("cart") ?? "[]")), products, boxes);
  } catch (err) {
    return { message: err instanceof CartError ? err.message : "No pudimos leer tu carrito. Recarga la página e inténtalo de nuevo.", values: contact };
  }

  try {
    const orderId = transaction(() => {
      const order = db.prepare(
        `INSERT INTO orders (user_id, total, name, email, phone, address, city, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, NULLIF(?, '')) RETURNING id`,
      ).get(user.id, priced.total, contact.name, contact.email, contact.phone, contact.address, contact.city, contact.notes) as { id: number };
      const insertItem = db.prepare(
        `INSERT INTO order_items (order_id, kind, moodbox_id, product_id, name, contents, quantity, unit_price, custom_message, letter_to, letter_from)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULLIF(?, ''), NULLIF(?, ''), NULLIF(?, ''))`,
      );
      for (const l of priced.lines) {
        insertItem.run(order.id, l.kind, l.moodboxId, l.productId, l.name, JSON.stringify(l.contents), l.quantity, l.unitPrice,
          l.letter?.message ?? "", l.letter?.to ?? "", l.letter?.from ?? "");
      }
      // Remember the delivery details for next time.
      db.prepare("UPDATE users SET phone = ?, address = ?, city = ? WHERE id = ?").run(contact.phone, contact.address, contact.city, user.id);
      return order.id;
    });
    return { orderId };
  } catch (err) {
    console.error("placeOrder failed", err);
    return { message: "No pudimos confirmar tu pedido. Inténtalo de nuevo en un momento.", values: contact };
  }
}

export async function updateProfile(_: FormState, fd: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/cuenta/datos");
  const v = {
    name: field(fd, "name").slice(0, 80), phone: field(fd, "phone").slice(0, 30),
    address: field(fd, "address").slice(0, 160), city: field(fd, "city").slice(0, 60),
  };
  if (v.name.length < 2) return { errors: { name: "Escribe tu nombre." }, values: v };
  db.prepare("UPDATE users SET name = ?, phone = NULLIF(?, ''), address = NULLIF(?, ''), city = NULLIF(?, '') WHERE id = ?")
    .run(v.name, v.phone, v.address, v.city, user.id);
  return { message: "Guardamos tus datos.", values: v };
}
