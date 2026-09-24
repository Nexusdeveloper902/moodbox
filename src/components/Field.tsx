import type { InputHTMLAttributes } from "react";
import { Icon } from "./Icon";

/** "Campo de texto" component with the error state from Penpot. */
export function Field({ label, name, error, className, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; name: string; error?: string }) {
  const id = `f-${name}`;
  return (
    <div className={`field ${className ?? ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <input id={id} name={name} className="input pr-11" aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} {...props} />
        {error && <Icon name="alert" className="absolute top-1/2 right-4 -translate-y-1/2 text-danger" />}
      </div>
      {error && <p id={`${id}-err`} className="field-error">{error}</p>}
    </div>
  );
}

export function FormMessage({ children, tone = "error" }: { children: React.ReactNode; tone?: "error" | "success" }) {
  return (
    <p role={tone === "error" ? "alert" : "status"}
      className={`flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold ${tone === "error" ? "bg-danger-soft text-danger" : "bg-teal-soft text-teal-dark"}`}>
      <Icon name={tone === "error" ? "alert" : "check"} className="shrink-0" />{children}
    </p>
  );
}
