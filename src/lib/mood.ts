// Deterministic "¿Cómo te sientes hoy?" matcher: keyword stems per MoodBox.
// ponytail: stem matching, not NLP. Add stems here when a phrasing is missed.

export type MoodSlug = "dia-dificil" | "necesito-relajarme" | "quiero-sorprender";

const STEMS: Record<MoodSlug, string[]> = {
  "dia-dificil": [
    "dificil", "pesad", "triste", "mal dia", "horrible", "llor", "desanim", "frustr", "fatal",
    "animo", "abrazo", "extran", "duro", "terrible", "deprim", "decepcion",
  ],
  "necesito-relajarme": [
    "relaj", "descans", "desconect", "calma", "tranquil", "estres", "dormir", "sueno", "pausa",
    "ansie", "agotad", "cansad", "rato para mi", "respirar", "paz", "agobi", "tension", "un rato",
  ],
  "quiero-sorprender": [
    "sorprend", "regal", "consent", "amig", "mama", "papa", "pareja", "novi", "herman", "cumple",
    "aniversario", "alguien", "especial", "agradec", "felicit", "detalle para", "celebr", "esposo", "esposa",
  ],
};

const ORDER: MoodSlug[] = ["necesito-relajarme", "dia-dificil", "quiero-sorprender"];

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export type MoodMatch = { slug: MoodSlug; words: string[]; matched: boolean };

/** Picks the MoodBox whose stems appear most often. Ties follow ORDER. */
export function recommendMood(text: string): MoodMatch {
  // Keep original tokens so we can echo the user's own words back.
  const tokens = text.match(/[\p{L}\p{N}]+/gu) ?? [];
  const norm = tokens.map(normalize);
  const joined = " " + norm.join(" ") + " ";

  let best: MoodMatch = { slug: "dia-dificil", words: [], matched: false };
  let bestScore = 0;
  for (const slug of ORDER) {
    const words = new Set<string>();
    let score = 0;
    for (const stem of STEMS[slug]) {
      if (stem.includes(" ")) {
        const at = joined.indexOf(" " + stem);
        if (at === -1) continue;
        score++;
        const start = joined.slice(0, at + 1).trim().split(" ").filter(Boolean).length;
        words.add(tokens.slice(start, start + stem.split(" ").length).join(" "));
      } else {
        norm.forEach((t, i) => {
          if (t.startsWith(stem)) { score++; words.add(tokens[i]!); }
        });
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = { slug, words: [...words].slice(0, 4).map((w) => w.toLowerCase()), matched: true };
    }
  }
  return best;
}

const SLUGS: MoodSlug[] = ["dia-dificil", "necesito-relajarme", "quiero-sorprender"];

/**
 * Validates a classifier reply like {"mood": "...", "words": ["..."]}.
 * Only the three known slugs are accepted, and "words" must be phrases that
 * really appear in what the user wrote (so model text is never echoed back).
 */
export function parseMoodReply(content: string, text: string): MoodMatch | null {
  let data: unknown;
  try { data = JSON.parse(content); } catch { return null; }
  const { mood, words } = (data ?? {}) as { mood?: unknown; words?: unknown };
  if (typeof mood !== "string" || !SLUGS.includes(mood as MoodSlug)) return null;
  const source = normalize(text);
  const found = (Array.isArray(words) ? words : [])
    .filter((w): w is string => typeof w === "string")
    .map((w) => w.trim().replace(/^[“"'«]+|[”"'».,!?…]+$/g, ""))
    .filter((w) => w.length > 1 && w.length <= 40 && source.includes(normalize(w)));
  return { slug: mood as MoodSlug, words: [...new Set(found.map((w) => w.toLowerCase()))].slice(0, 4), matched: true };
}
