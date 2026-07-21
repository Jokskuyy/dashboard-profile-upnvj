# Lighthouse reports

Run both mobile and desktop audits with:

```bash
npm run lighthouse
```

The command builds the production bundle and updates these local artifacts:

- `latest-summary.md` — small score and metric summary.
- `AI_HANDOFF_LATEST.md` — detailed findings, interpretation, and priorities for the next AI.
- `latest-mobile.html` / `latest-desktop.html` — complete interactive reports.
- `latest-mobile.json` / `latest-desktop.json` — machine-readable reports.

HTML and JSON artifacts are ignored by Git because they are large and change on every run. The summary remains versionable.
