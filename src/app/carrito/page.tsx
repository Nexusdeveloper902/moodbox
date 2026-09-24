import { CartView } from "@/components/CartView";
import { getViewCatalog } from "@/lib/catalogView";

export const metadata = { title: "Tu carrito" };

export default async function CartPage() {
  return (
    <div className="wrap pt-8 pb-20 md:pt-12 md:pb-24">
      <h1 className="h-display text-[40px] text-ink md:text-[64px] md:leading-[1.2]">Tu carrito</h1>
      <CartView catalog={await getViewCatalog()} />
    </div>
  );
}
