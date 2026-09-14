# AIM Site Hub

The canonical public Hub is this repository's `index.html`. The workspace `AIM Website/aim-site-hub.html` is a local entry and pointer; do not export it over the canonical page.

## Published

Repository: https://github.com/eppelas/aim-site-hub
Pages: https://eppelas.github.io/aim-site-hub/

Pages uses `build_type: workflow`. Pushes to `main` and manual runs execute `.github/workflows/pages.yml`: browser checks at 1440 and 390 verify cards, editor links, mandatory instructions, and the password disclosure before deployment. Mobile must have no document overflow; the existing desktop 32px baseline must not grow. Evidence is attached to the workflow run.

## Source and artifact boundaries

Edit Hub content in `index.html`. Bot and update rules live in `website-ops/`; keep their workspace mirrors and generated Hub summaries synchronized. Preserve the separate Main, Wild, and V3 links.

The Pages artifact uses an explicit allowlist of existing public HTML, assets, and operations documents. Test tools, workflows, Git metadata, QA evidence, and private backups are excluded. The local feedback registry remains excluded because it contains workspace paths and review memory.
