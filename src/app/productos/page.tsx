import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DraftBadge, ProductGrid } from "@/components/ProductGrid";
import { getProducts } from "@/lib/data";

export const metadata = { title: "Productos" };

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <div className="wrap pt-8 pb-16 md:pt-10 md:pb-24">
      <Breadcrumbs items={[["Inicio", "/"], ["Productos"]]} />
      <div className="mt-4 mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="h-display text-[40px] md:text-[64px] md:leading-[1.2]">Productos</h1>
          <p className="mt-2 max-w-[580px] text-lg leading-normal text-muted md:text-xl">
            Todo lo que puedes poner en tu caja. Agrega lo que quieras y lo guardamos en tu MoodBox personalizada.
          </p>
        </div>
        <DraftBadge products={products} />
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
