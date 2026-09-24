import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { RegisterForm } from "@/components/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Crear cuenta" };

export default async function RegisterPage({ searchParams }: PageProps<"/registro">) {
  const next = String((await searchParams).next ?? "/cuenta");
  if (await getCurrentUser()) redirect("/cuenta");
  return (
    <AuthShell title="Crea tu cuenta" subtitle="Así guardamos tus pedidos y tus cartas favoritas.">
      <RegisterForm next={next} />
    </AuthShell>
  );
}
