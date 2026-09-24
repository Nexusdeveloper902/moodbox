import Link from "next/link";

export function Logo({ dark = false, size = "md" }: { dark?: boolean; size?: "sm" | "md" }) {
  const s = size === "sm" ? { icon: 34, text: "text-[21px]" } : { icon: 46, text: "text-[27px]" };
  return (
    <Link href="/" className="flex items-center gap-1 rounded-lg" aria-label="MoodBox, ir al inicio">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dark ? "/moodbox/icon-dark.svg" : "/moodbox/icon.svg"} alt="" width={s.icon} height={s.icon} />
      <span className={`font-serif font-bold tracking-tight ${s.text} ${dark ? "text-cream" : "text-ink"}`}>
        Mood<span className="text-coral">Box</span>
      </span>
    </Link>
  );
}
