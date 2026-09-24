"use client";
import { Icon } from "@/components/Icon";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap py-16 text-center">
      <span className="mx-auto grid size-16 place-items-center rounded-full bg-blush text-coral"><Icon name="alert" size={28} /></span>
      <h1 className="h-display mt-5 text-[34px] text-ink">Algo salió mal</h1>
      <p className="mt-3 text-muted">No pudimos cargar esta página. Inténtalo de nuevo en un momento.</p>
      <button type="button" onClick={reset} className="btn-primary mt-6">Reintentar</button>
    </div>
  );
}
