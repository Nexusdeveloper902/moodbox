import { redirect } from "next/navigation";
import { AuthShell } from "@/components/AuthShell";
import { LoginForm } from "@/components/AuthForms";
import { getCurrentUser } from "@/lib/auth";

export const metadata = { title: "Iniciar sesión" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const next = String((await searchParams).next ?? "/cuenta");
  if (await getCurrentUser()) redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/cuenta");
  return (
    <AuthShell title="Hola de nuevo" subtitle="Inicia sesión para ver tus pedidos y comprar más rápido.">
      <LoginForm next={next} />
    </AuthShell>
  );
}
