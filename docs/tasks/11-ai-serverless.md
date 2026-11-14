# Task 11 — AI via serverless functions (parse + explain)
Read: TERAX.md + CAHIER_DES_CHARGES.md section 9 only.
Do:
0. Handler format (no `@vercel/node`, no new dependency): `export default { async fetch(request: Request): Promise<Response> { ... } }` in each `api/*.ts`. Verify with `npx vercel dev` before relying on it.
1. `api/parse.ts` (Vercel function): receives `{ text, today }`, calls the OpenAI-compatible endpoint with `fetch` (`AI_BASE_URL`, `AI_API_KEY`, `AI_MODEL`), temperature 0.1, 15 s timeout, 1 retry. System prompt forces JSON only, schema from the spec. Validate the JSON by hand (types, positive integer amounts, valid dates); invalid -> HTTP 422.
2. `api/explain.ts`: receives the numeric result of the engine, returns 2-3 simple French sentences. The function checks that every number in the text exists in the input; otherwise returns 422.
3. `src/ai/client.ts`: `parseEntry(text)` and `explain(result)` call `/api/...`; on any failure (network, 4xx/5xx, `AI_ENABLED` false) return `fallback.ts` output. A small badge "Explication IA" or "Message standard" shows which path was used.
4. Never expose the key in the browser. Add the env vars in Vercel.
Done when: with the key the saisie and the alerts use the AI; with the key removed the app behaves exactly like before; no number in an AI sentence is missing from the engine result. Build passes. Commit and push.
