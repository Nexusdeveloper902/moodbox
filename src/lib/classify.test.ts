import { test, afterEach } from "node:test";
import assert from "node:assert/strict";
import { classifyMood } from "./classify.ts";

const realFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = realFetch; delete process.env.DEEPSEEK_API_KEY; });

const reply = (content: string, status = 200) =>
  (async () => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status })) as typeof fetch;

test("uses DeepSeek's answer, sending JSON mode with thinking disabled", async () => {
  process.env.DEEPSEEK_API_KEY = "test-key";
  let body: Record<string, unknown> = {};
  let auth = "";
  globalThis.fetch = (async (_url: string, init: RequestInit) => {
    body = JSON.parse(String(init.body));
    auth = new Headers(init.headers).get("authorization") ?? "";
    return new Response(JSON.stringify({ choices: [{ message: { content: '{"mood":"quiero-sorprender","words":["mi abuela"]}' } }] }));
  }) as typeof fetch;

  // Keywords alone would pick "dia-dificil" here ("difícil"); the model decides instead.
  const r = await classifyMood("Fue un año difícil para mi abuela y quiero que sonría");
  assert.equal(r.source, "deepseek");
  assert.equal(r.slug, "quiero-sorprender");
  assert.deepEqual(r.words, ["mi abuela"]);
  assert.equal(auth, "Bearer test-key");
  assert.deepEqual(body.response_format, { type: "json_object" });
  assert.deepEqual(body.thinking, { type: "disabled" });
  assert.equal(body.model, "deepseek-flash");
});

test("falls back to keywords on invalid replies, HTTP errors, network errors and missing key", async () => {
  const text = "Necesito descansar";
  process.env.DEEPSEEK_API_KEY = "test-key";
  for (const f of [reply('{"mood":"otra-cosa"}'), reply("", 500), (async () => { throw new Error("offline"); }) as typeof fetch]) {
    globalThis.fetch = f;
    const r = await classifyMood(text);
    assert.equal(r.source, "keywords");
    assert.equal(r.slug, "necesito-relajarme");
  }
  delete process.env.DEEPSEEK_API_KEY;
  globalThis.fetch = (async () => assert.fail("must not call the API without a key")) as typeof fetch;
  assert.equal((await classifyMood(text)).source, "keywords");
});
