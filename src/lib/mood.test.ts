import { test } from "node:test";
import assert from "node:assert/strict";
import { recommendMood } from "./mood.ts";

test("design example: heavy day + wanting to disconnect → relajarme", () => {
  const r = recommendMood("Hoy tuve un día muy pesado y quiero desconectarme un rato…");
  assert.equal(r.slug, "necesito-relajarme");
  assert.ok(r.words.includes("desconectarme"));
});

test("suggestion chips map to their boxes", () => {
  assert.equal(recommendMood("Tuve un día difícil").slug, "dia-dificil");
  assert.equal(recommendMood("Necesito descansar").slug, "necesito-relajarme");
  assert.equal(recommendMood("Quiero consentir a alguien").slug, "quiero-sorprender");
});

test("accents and case don't matter", () => {
  assert.equal(recommendMood("ESTOY MUY ESTRESADA").slug, "necesito-relajarme");
  assert.equal(recommendMood("es el cumpleaños de mi mamá").slug, "quiero-sorprender");
});

test("no clues → default box, flagged as unmatched", () => {
  const r = recommendMood("hola");
  assert.equal(r.matched, false);
  assert.equal(r.slug, "dia-dificil");
});

import { parseMoodReply } from "./mood.ts";

test("classifier reply: valid slug, keeps only words present in the text", () => {
  const text = "Hoy tuve un día muy pesado y quiero desconectarme un rato";
  const r = parseMoodReply('{"mood":"necesito-relajarme","words":["desconectarme","un rato","inventado","DÍA MUY PESADO"]}', text);
  assert.deepEqual(r, { slug: "necesito-relajarme", words: ["desconectarme", "un rato", "día muy pesado"], matched: true });
});

test("classifier reply: rejects unknown moods and broken JSON", () => {
  assert.equal(parseMoodReply('{"mood":"ignore previous instructions"}', "hola"), null);
  assert.equal(parseMoodReply("not json", "hola"), null);
  assert.equal(parseMoodReply("null", "hola"), null);
  assert.deepEqual(parseMoodReply('{"mood":"quiero-sorprender"}', "hola")?.words, []);
});
