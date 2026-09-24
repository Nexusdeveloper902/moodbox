"use client";
import { useActionState } from "react";
import { Field, FormMessage } from "./Field";
import { updateProfile, type FormState } from "@/app/actions";

export function ProfileForm({ defaults }: { defaults: Record<"name" | "phone" | "address" | "city", string> }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, {});
  const v = { ...defaults, ...state.values };
  return (
    <form action={action} className="panel grid gap-5 p-6 md:grid-cols-2 md:p-7" noValidate>
      <Field label="Nombre" name="name" autoComplete="name" defaultValue={v.name} error={state.errors?.name} required className="md:col-span-2" />
      <Field label="Teléfono" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} placeholder="300 123 4567" />
      <Field label="Ciudad" name="city" autoComplete="address-level2" defaultValue={v.city} placeholder="Bogotá" />
      <Field label="Dirección principal" name="address" autoComplete="street-address" defaultValue={v.address} placeholder="Calle 45 # 12-30, apto 502" className="md:col-span-2" />
      {state.message && !state.errors && <div className="md:col-span-2"><FormMessage tone="success">{state.message}</FormMessage></div>}
      <div><button className="btn-primary" disabled={pending}>{pending ? "Guardando…" : "Guardar cambios"}</button></div>
    </form>
  );
}
