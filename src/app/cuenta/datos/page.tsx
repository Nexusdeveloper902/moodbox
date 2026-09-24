import { ProfileForm } from "@/components/ProfileForm";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Datos personales" };

export default async function ProfilePage() {
  const user = await requireUser("/cuenta/datos");
  return (
    <>
      <h1 className="h-display text-[40px] text-ink md:text-[64px] md:leading-[1.2]">Datos personales</h1>
      <p className="mt-1 mb-8 text-lg text-muted">Usamos esta dirección para prellenar tus próximos pedidos. Tu correo es {user.email}.</p>
      <ProfileForm defaults={{ name: user.name, phone: user.phone ?? "", address: user.address ?? "", city: user.city ?? "" }} />
    </>
  );
}
