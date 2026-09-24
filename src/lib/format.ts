const cop = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

/** 45000 → "$45.000" */
export function formatCOP(value: number) {
  return `$${cop.format(value)}`;
}

/** "23 de septiembre de 2026" */
export function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Bogota" });
}

export function orderRef(id: number) {
  return `#MB-${String(id).padStart(4, "0")}`;
}

export function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("");
}
