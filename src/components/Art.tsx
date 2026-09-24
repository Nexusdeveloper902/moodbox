import "server-only";
import { readFileSync } from "node:fs";
import path from "node:path";

const cache = new Map<string, string>();

/**
 * Inlines a Penpot-exported SVG from /public so its <text> can use the page's
 * self-hosted fonts (an <img> can't reach them).
 */
export function Art({ src, alt, className }: { src: string; alt: string; className?: string }) {
  let svg = cache.get(src);
  if (!svg) {
    svg = readFileSync(path.join(process.cwd(), "public", src), "utf8")
      .replaceAll("&quot;Fraunces&quot;", "var(--font-fraunces)")
      .replaceAll("&quot;DM Sans&quot;", "var(--font-dm-sans)")
      .replaceAll("&quot;Caveat Brush&quot;", "var(--font-caveat)");
    cache.set(src, svg);
  }
  const labelled = svg.replace("<svg ", `<svg role="img" aria-label="${alt.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}" `);
  return <div className={`[&>svg]:h-full [&>svg]:w-full ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: labelled }} />;
}
