# social-tool-rules

CSS selectors for the Quiet Social browser extension, kept separate so a broken
selector can be fixed without releasing a new extension version.

## Format (`rules.json`)
- `version`: integer. **Bump it on every change** — the extension only replaces its
  bundled copy with a remote one whose version is >= the bundled version, and refreshes every 12h.
- `sites[]`: `id`, `name`, `matches` (manifest patterns), `hosts`, and
  `selectors.{feed,media,status}` (arrays of plain CSS selectors).

- `sites[].elements[]`: `{id, label, selector}` — the **only** elements that get an edit chip (✕ / ✎) in the
  extension's edit mode. Curate these; the category `selectors` still drive automatic hiding.

Selectors containing `{ } ; @ \ <`, `url(` or comments are rejected by the extension.

## Notes
- Adding a **new site** still needs an extension release (content-script `matches` are static).
- The extension fetches `https://raw.githubusercontent.com/OWNER/social-tool-rules/main/rules.json`;
  update `RULES_URL` in `utils/rules.ts` of the extension to your real repo.
- After changing rules, run `npm run sync-rules` in the extension to refresh its bundled fallback.

## Element ids (keep users' saved choices working)
Users' hide/show choices are saved **by element `id`**, not by selector or label. So:
- Give every element a short, stable `id` (e.g. `star-count`) and **never change or reuse it**.
- You can freely change an element's `selector` or `label` — saved choices follow the id.
- When you **merge or rename** elements, give the new one `replaces: ["old-id", ...]`. Users who had hidden any
  of the old ones keep that choice on the new one (hidden wins if the old ones disagree).
- Removing an element with no replacement just stops applying the old choice (it is kept in storage, harmless).
- `node check.mjs` enforces unique ids and that `replaces` never names an id that still exists.
