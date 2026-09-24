"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Icon } from "./Icon";
import { cart, useStore } from "@/lib/store";

/** "¡Listo! Agregamos tu MoodBox al carrito" notification from Penpot. */
export function Toast() {
  const { toast } = useStore();
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(cart.dismissToast, 4500);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-4 top-20 z-50 flex justify-end md:top-[104px] md:right-6 md:left-auto">
      {toast && (
        <div key={toast.id} className="pointer-events-auto flex w-full max-w-[456px] items-center gap-3 rounded-[18px] bg-ink py-3.5 pr-5 pl-3.5 shadow-[0_16px_40px_rgb(59_42_38/0.2)]">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal text-white"><Icon name="check" size={16} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-bold text-white">{toast.title}</p>
            <p className="truncate text-[13px] text-plum-muted">{toast.detail}</p>
          </div>
          <Link href="/carrito" onClick={cart.dismissToast} className="shrink-0 text-sm font-bold text-honey">Ver carrito</Link>
        </div>
      )}
    </div>
  );
}
