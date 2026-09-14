# AIM Site Hub

The canonical public Hub is this repository's `index.html`. The workspace `AIM Website/aim-site-hub.html` is an older full HTML page, not a redirect. The preview server serves the canonical Hub at `/aim-site-hub/` and that legacy page at `/preview/legacy-aim-site-hub/`. Do not export the legacy page over the canonical page. Only deliberately changed blocks are synchronized; no automatic full-page mirroring is promised.

## Current website entries

Current website entry hierarchy (owner-approved): (1) Google Wild with text editing, (2) the final accepted Wild version in the owner’s personal GitHub, awaiting deployment to the main server, and (3) the currently operating production website on its server. A GitHub Pages preview is not a launch on the production server. Sanity, staging, V3 and the older experimental Main are archive references; their guides and links remain available.

## Published

Repository: https://github.com/eppelas/aim-site-hub
Pages: https://eppelas.github.io/aim-site-hub/

Pages uses `build_type: workflow`. Pushes to `main` and manual runs execute `.github/workflows/pages.yml`: browser checks at 1440, 1024, 768, 390 and 320 verify all six tabs, primary destinations, archive placement, the password disclosure, map links, keyboard use, search, internal links and standalone documentation pages before deployment. The page and navigation must fit the viewport without horizontal scrolling at every tested width; wide tables may scroll inside their own containers. Evidence is attached to the workflow run.

## Source and artifact boundaries

Edit Hub content in `index.html`. Bot and update rules live in `website-ops/`; keep their workspace mirrors and generated Hub summaries synchronized. Keep the three current entries prominent and retain older Main, V3, Sanity and staging links in the archive.

The Pages artifact uses an explicit allowlist of existing public HTML, assets, and operations documents. Test tools, workflows, Git metadata, QA evidence, and private backups are excluded. The local feedback registry remains excluded because it contains workspace paths and review memory.

## Employee-facing reference cards

Presentation lives in `hubTitle`, `hubSummary` and `hubScope` within the JSON registries. Bot records also use `hubBot`; tools use `hubGroup`, `hubHref` and `hubAction`. The original operational rules and checks remain unchanged. Renderers require the presentation fields so raw prompts, machine statuses and verification receipts cannot silently return to the employee interface.

Run the three `tools/sync-*-summary.mjs` scripts after changing a registry. `--check` checks for drift without writing; `--stdout` renders without writing. In a standalone clone they use this repo. In the original AIM Website workspace they read the workspace registries and update the repo mirrors plus generated blocks in both HTML surfaces. Existing `local-preview` scripts import these versioned renderers. Pages CI checks registry consistency before browser verification and publication.
