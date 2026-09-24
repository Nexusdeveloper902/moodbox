import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductActions } from "@/components/ProductActions";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, getProducts } from "@/lib/data";
import { CATEGORIES } from "@/lib/theme";

export async function generateMetadata({ params }: PageProps<"/productos/[slug]">) {
  const p = await getProduct((await params).slug);
  return { title: p?.name ?? "Producto no encontrado" };
}

export default async function ProductDetail({ params }: PageProps<"/productos/[slug]">) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const category = CATEGORIES.find((c) => c.id === p.category)!;
  const related = (await getProducts()).filter((o) => o.category === p.category && o.slug !== p.slug);

  return (
    <div className="wrap pt-6 pb-20 md:pt-8">
      <Breadcrumbs items={[["Inicio", "/"], ["Productos", "/productos"], [p.name]]} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[560px_1fr] lg:gap-[60px]">
        <div className="relative grid aspect-square place-items-center rounded-[32px] bg-sand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.image} alt={p.name} className={`w-[62%] ${p.available ? "" : "opacity-60"}`} />
          {!p.available && <span className="absolute top-5 left-5 rounded-full bg-disabled px-3 py-1.5 text-[13px] font-bold text-muted">Agotado</span>}
        </div>
        <div className="lg:pt-6">
          <p className="kicker text-[13px] text-coral">{category.title}</p>
          <h1 className="h-display mt-3 text-[40px] text-ink md:text-[64px]">{p.name}</h1>
          <p className="mt-4 mb-8 text-lg leading-[1.55] text-muted">{p.description}. Puedes llevarlo solo o sumarlo a tu MoodBox personalizada junto con una carta escrita a mano.</p>
          <ProductActions product={p} />
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-16 md:mt-20" aria-labelledby="relacionados">
          <h2 id="relacionados" className="h-display text-[26px] md:text-[34px]">Más de {category.title.toLowerCase()}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5">
            {related.map((r) => <ProductCard key={r.slug} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
