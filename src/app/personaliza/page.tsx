import { Art } from "@/components/Art";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Builder } from "@/components/Builder";
import { getMoodbox, getProducts } from "@/lib/data";
import { CUSTOM_BOX_ART } from "@/lib/theme";

export const metadata = { title: "Personaliza tu MoodBox" };

export default async function PersonalizePage({ searchParams }: PageProps<"/personaliza">) {
  const desde = (await searchParams).desde;
  const [products, box] = await Promise.all([getProducts(), typeof desde === "string" ? getMoodbox(desde) : null]);
  const prefill = box ? box.items.filter((i) => i.in_catalog).map((i) => i.slug) : null;

  return (
    <div className="wrap pt-6 pb-10 md:pt-8 md:pb-24">
      <div className="hidden md:block"><Breadcrumbs items={[["Inicio", "/"], ["Personaliza tu caja"]]} /></div>
      <div className="mt-2 flex flex-wrap items-end gap-x-10 gap-y-1 md:mt-4">
        <div>
          <h1 className="h-display text-[34px] text-ink md:text-[64px]">Personaliza tu MoodBox</h1>
          <p className="mt-2 text-[15px] text-muted md:text-xl">Elige los detalles que quieres incluir.</p>
        </div>
        <p className="hidden -rotate-2 font-hand text-[30px] text-coral md:block">“Tú eliges qué lleva.”</p>
      </div>
      <div className="mt-6">
        <Builder products={products} prefill={prefill} art={<Art src={CUSTOM_BOX_ART} alt="Caja abierta Tu MoodBox" className="h-[176px] w-full" />} />
      </div>
    </div>
  );
}
