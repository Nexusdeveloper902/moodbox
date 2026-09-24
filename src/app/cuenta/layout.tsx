import { AccountNav } from "@/components/AccountNav";
import { requireUser } from "@/lib/auth";
import { initials } from "@/lib/format";

export default async function AccountLayout({ children }: LayoutProps<"/cuenta">) {
  const user = await requireUser("/cuenta");
  return (
    <div className="wrap grid items-start gap-8 pt-8 pb-20 md:pt-12 lg:grid-cols-[280px_1fr] lg:gap-10">
      <AccountNav name={user.name} email={user.email} initials={initials(user.name)} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
