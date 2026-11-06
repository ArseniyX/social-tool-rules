import { readFileSync } from 'node:fs';
const r = JSON.parse(readFileSync(new URL('./rules.json', import.meta.url)));
const bad = /[{};@\\<>]|url\s*\(|\/\*/i;
let errors = 0;
if (!Number.isInteger(r.version)) { console.error('version must be an integer'); errors++; }
for (const s of r.sites) for (const c of ['feed', 'media', 'status'])
  for (const sel of s.selectors[c] ?? []) if (bad.test(sel)) { console.error(`${s.id}.${c}: unsafe selector ${sel}`); errors++; }
console.log(errors ? `${errors} problem(s)` : `ok: ${r.sites.length} sites, version ${r.version}`);
process.exit(errors ? 1 : 0);
