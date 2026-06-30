# Sanity, Astro, Payment, And Staging Map

Use this reference when explaining how AIM lab content moves through CMS, site
builds, staging, payment, and the AIM Site Hub.

## System Roles

- Sanity CMS is the content source for the AIM Website.
- Astro 5 builds static pages from Sanity data at build time.
- React islands handle interactive pricing/payment UI on the client.
- NocoDB, owned by Dan's payment catalog, is the source for product/tariff
  product codes and prices.
- The payment backend is n8n at `https://n8n.aimindset.org`; the website calls it
  through `/api/payment/*`.
- AIM Site Hub is an ops/review surface that links the current site, staging, QA,
  product rules, bot rules, analytics, and content pipelines.

## Sanity Content Model

The site has two Sanity document containers with `blocks[]`:

- `mainPage` for `/`;
- `lab` for `/labs/[slug]`.

Lab pages use inline blocks for hero/description/pricing/program and reference
blocks for shared entities such as speakers, cases, reviews, FAQ, quotes,
philosophy pillars, and closing phrases.

The Studio project is `ms4mgrt9`, dataset `production` in `studio/sanity.config.ts`
and `studio/sanity.cli.ts`. The website runtime reads `SANITY_PROJECT_ID`,
`SANITY_DATASET`, and `SANITY_API_VERSION`.

## Astro Freshness

`src/lib/sanity.ts` uses `@sanity/client` with `useCdn: false` for server-side
build-time reads. This avoids the Sanity CDN delay after publish when the Sanity
webhook triggers a rebuild immediately.

Routes:

- `/` -> `src/pages/index.astro`;
- `/labs/[slug]` -> `src/pages/labs/[slug].astro`;
- `/admin` redirects to Sanity Studio.

## MD Import Paths

There are two content-to-Sanity paths:

- Studio path: export fresh `common_content.md`, ask an agent to fill the lab MD,
  then upload through `Создать лабу из MD` or `Обновить из MD`.
- Git path: put the MD file under `content/labs/` and push to `main`;
  `.github/workflows/import-labs.yml` runs `npm run import-lab` for changed files.

After Sanity receives a publish/update, the Sanity webhook sends
`repository_dispatch: sanity-content-update`, which triggers staging and new
deploy workflows.

## Payment Connection

Sanity stores `pricingBlock.plans[].productCode`; prices are not hardcoded in
Sanity or Astro output.

Runtime price display:

1. `PricingCards` deduplicates product codes on mount.
2. It calls `/api/payment/site-discount-check` for each code.
3. Successful responses fill the visible base EUR price.
4. If a code is absent, unknown, or the runtime check fails, the card falls back
   to `цена уточняется`; the popup still performs its own discount-check when
   possible.

Product codes must come from Dan's NocoDB catalog. The naming convention is not
authority; Dan can confirm different codes.

## Staging And Deploy

Main deploy triggers:

- push to `main`;
- Sanity publish via webhook;
- manual `workflow_dispatch`.

The Sanity webhook triggers both:

- `deploy-staging.yml` -> `https://staging.aimindset.org/`;
- `deploy-new.yml` -> `https://new.aimindset.org/`.

The shared deploy workflow runs `npm run build`, updates payment-proxy resources,
and rsyncs `dist/` to the VPS paths.

## Hub Rule

When the content pipeline changes, update:

- `website-ops/sanity-cms-lab-pipeline.md`;
- `aim-site-hub.html`;
- `local-preview/README.md`;
- `TASK_VERIFICATION_CANVAS.md`;
- the public Hub mirror if maintaining the GitHub Pages export locally.
