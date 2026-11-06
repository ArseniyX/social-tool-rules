# social-tool-rules

CSS selectors for the Quiet Social browser extension, kept separate so a broken
selector can be fixed without releasing a new extension version.

## Format (`rules.json`)
- `version`: integer. **Bump it on every change** — the extension only replaces its
  bundled copy with a remote one whose version is >= the bundled version, and refreshes every 12h.
- `sites[]`: `id`, `name`, `matches` (manifest patterns), `hosts`, and
  `selectors.{feed,media,status}` (arrays of plain CSS selectors).

Selectors containing `{ } ; @ \ < >`, `url(` or comments are rejected by the extension.

## Notes
- Adding a **new site** still needs an extension release (content-script `matches` are static).
- The extension fetches `https://raw.githubusercontent.com/OWNER/social-tool-rules/main/rules.json`;
  update `RULES_URL` in `utils/rules.ts` of the extension to your real repo.
- After changing rules, run `npm run sync-rules` in the extension to refresh its bundled fallback.
