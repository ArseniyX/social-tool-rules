import { readFileSync } from 'node:fs';
const r = JSON.parse(readFileSync(new URL('./rules.json', import.meta.url)));
const bad = /[{};@\\<]|url\s*\(|\/\*/i;
let errors = 0;
if (!Number.isInteger(r.version)) { console.error('version must be an integer'); errors++; }
for (const s of r.sites) for (const c of ['feed', 'media', 'status'])
  for (const sel of s.selectors[c] ?? []) if (bad.test(sel)) { console.error(`${s.id}.${c}: unsafe selector ${sel}`); errors++; }
// Every element needs a stable id (users' saved choices are stored by it): unique per site, never reused.
// `replaces` lists the old ids a merged/renamed element takes over, so nobody loses their saved choices.
const ID = /^[\w-]{1,60}$/;
for (const s of r.sites) {
  const ids = new Set();
  for (const e of s.elements ?? []) {
    if (typeof e.id !== 'string' || !ID.test(e.id)) { console.error(`${s.id}: element "${e.label}" needs an id like "star-count"`); errors++; continue; }
    if (ids.has(e.id)) { console.error(`${s.id}: duplicate element id "${e.id}"`); errors++; }
    ids.add(e.id);
  }
  for (const e of s.elements ?? []) for (const old of e.replaces ?? []) {
    if (ids.has(old)) { console.error(`${s.id}.${e.id}: replaces "${old}" but that id still exists`); errors++; }
  }
}
console.log(errors ? `${errors} problem(s)` : `ok: ${r.sites.length} sites, version ${r.version}`);
process.exit(errors ? 1 : 0);
