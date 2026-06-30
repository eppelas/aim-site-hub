# Sanity API Access For AIM Labs

Use this reference when an agent needs to inspect, import, export, or explain
Sanity access. Do not print secrets.

## Local Environment Variables

The site and scripts use:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET` (defaults to `production` in scripts/client code)
- `SANITY_API_VERSION` (defaults to `2026-03-29`)
- `SANITY_API_TOKEN` for write operations and full export/import scripts

Studio config hardcodes:

- project: `ms4mgrt9`
- dataset: `production`
- Studio dev port: `3343`

## Read Client

Build-time reads use:

```js
createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID,
  dataset: import.meta.env.SANITY_DATASET || 'production',
  apiVersion: import.meta.env.SANITY_API_VERSION || '2026-03-29',
  useCdn: false,
})
```

`useCdn: false` is intentional for freshness after Sanity webhook rebuilds.

## Write/Import Client

CLI import uses `scripts/import-lab.mjs`:

```bash
cd "Site Repo - ai-mindset-website"
npm run import-lab content/labs/<slug>.md
```

It loads `.env` if present, requires `SANITY_PROJECT_ID` and
`SANITY_API_TOKEN`, and writes with `useCdn: false`.

CLI export uses:

```bash
npm run export-lab <slug>
npm run export-lab -- --all
```

Export writes to `content/labs/<slug>.md` and skips external labs because they do
not have an MD representation.

## Studio UI

Run locally:

```bash
cd "Site Repo - ai-mindset-website/studio"
npm install
npm run dev
```

Studio exposes:

- `Экспорт общего контента` in the navbar; downloads `common_content.md` from
  published shared entities.
- `Создать лабу из MD` in the navbar; creates a new lab from a file when the slug
  is free.
- `Обновить из MD` in a lab document action; updates the open lab only when the
  file slug matches the lab slug.

## Clean Sanity CLI Bootstrap

Use the existing repo Studio first. If it is unavailable or a clean inspection
surface is needed, create a scratch Studio connected to the AIM project:

```bash
mkdir -p ~/tmp/aim-sanity-clean
cd ~/tmp/aim-sanity-clean
npm create sanity@latest -- --project ms4mgrt9 --dataset production --template clean
```

Run this only in a scratch folder. It creates a new Studio scaffold and should
not be run inside the active AIM Website repo unless the task explicitly calls
for regenerating Studio files.

## GitHub Actions

- `.github/workflows/import-labs.yml` imports changed `content/labs/**/*.md`
  files on push to `main`.
- `.github/workflows/deploy-staging.yml` and `deploy-new.yml` respond to
  `repository_dispatch: sanity-content-update`.
- Sanity webhook setup lives in
  `docs/guides/sanity-rebuild-webhook-setup.md`.
