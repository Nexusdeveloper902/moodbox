import Link from "next/link";

export function Breadcrumbs({ items }: { items: [label: string, href?: string][] }) {
  return (
    <nav aria-label="Ruta" className="text-sm text-subtle">
      <ol className="flex flex-wrap gap-2">
        {items.map(([label, href], i) => (
          <li key={label} className="flex gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {href ? <Link href={href} className="hover:text-ink">{label}</Link> : <span aria-current="page">{label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
