import { CheckoutForm } from "@/components/CheckoutForm";
import { requireUser } from "@/lib/auth";
import { getViewCatalog } from "@/lib/catalogView";

export const metadata = { title: "Finaliza tu pedido" };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  return (
    <div className="wrap pt-8 pb-20 md:pt-10">
      <CheckoutForm catalog={await getViewCatalog()}
        defaults={{ name: user.name, email: user.email, phone: user.phone ?? "", address: user.address ?? "", city: user.city ?? "" }} />
    </div>
  );
}
