"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Field, FormMessage } from "./Field";
import { login, register, type FormState } from "@/app/actions";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <Field label="Correo electrónico" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required
        defaultValue={state.values?.email} error={state.errors?.email} />
      <Field label="Contraseña" name="password" type="password" autoComplete="current-password" placeholder="••••••••" required error={state.errors?.password} />
      {state.message && <FormMessage>{state.message}</FormMessage>}
      <button className="btn-primary mt-1 w-full" disabled={pending}>{pending ? "Entrando…" : "Iniciar sesión"}</button>
      <p className="text-center text-[15px] text-muted">
        ¿No tienes cuenta? <Link href={`/registro?next=${encodeURIComponent(next)}`} className="font-bold text-coral">Crear cuenta</Link>
      </p>
    </form>
  );
}

export function RegisterForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(register, {});
  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <input type="hidden" name="next" value={next} />
      <Field label="Nombre" name="name" autoComplete="name" placeholder="Laura Gómez" required defaultValue={state.values?.name} error={state.errors?.name} />
      <Field label="Correo electrónico" name="email" type="email" autoComplete="email" placeholder="tu@correo.com" required defaultValue={state.values?.email} error={state.errors?.email} />
      <Field label="Contraseña" name="password" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" required minLength={8} error={state.errors?.password} />
      <Field label="Confirmar contraseña" name="confirm" type="password" autoComplete="new-password" required error={state.errors?.confirm} />
      <div>
        <label className="flex items-center gap-3 text-[15px] text-ink">
          <input type="checkbox" name="terms" className="size-5 accent-coral" aria-invalid={state.errors?.terms ? true : undefined} />
          Acepto los términos y la política de privacidad
        </label>
        {state.errors?.terms && <p className="field-error mt-2">{state.errors.terms}</p>}
      </div>
      {state.message && <FormMessage>{state.message}</FormMessage>}
      <button className="btn-primary w-full" disabled={pending}>{pending ? "Creando tu cuenta…" : "Crear cuenta"}</button>
      <p className="text-center text-[15px] text-muted">
        ¿Ya tienes cuenta? <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-coral">Iniciar sesión</Link>
      </p>
    </form>
  );
}
