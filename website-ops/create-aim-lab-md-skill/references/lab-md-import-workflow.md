# AIM Lab MD Import Workflow

Use this reference when creating, reviewing, or explaining a lab Markdown import
file.

## Canonical Sources

- Template/instructions: `Site Repo - ai-mindset-website/docs/guides/create-lab-from-md.md`.
- Format specification: `Site Repo - ai-mindset-website/docs/architecture/md-format.md`.
- Common content exporter: `Site Repo - ai-mindset-website/studio/lib/commonContentMd.mjs`.
- Studio buttons:
  - `Экспорт общего контента` in `studio/components/ExportCommonContentButton.tsx`;
  - `Создать лабу из MD` in `studio/components/CreateLabFromMdButton.tsx`;
  - `Обновить из MD` in `studio/actions/importLabMd.ts`.
- CLI import/export:
  - `npm run import-lab <file.md>` -> `scripts/import-lab.mjs`;
  - `npm run export-lab <slug>` -> `scripts/export-lab.mjs`.

## Required Inputs

- Fresh `common_content.md` exported from Studio.
- Lab content: name/theme, slug, dates, duration, speaker list, case list,
  pricing/tariff composition, product codes, quotes, reviews, FAQ IDs, and any
  source/previous lab page.
- Product codes from Dan's NocoDB catalog. They are not derived from the page
  slug.

## File Rules

- Frontmatter must include `name`, `slug`, `startDate`, `endDate`.
- Dates are strict `YYYY-MM-DD`.
- `slug` is the Sanity identity and URL part. The filename does not determine
  identity.
- If `status` is absent for a new lab, the import creates it as `draft`.
- Inline blocks: `hero`, `description`, `pricing`, `program`.
- Reference blocks: `cases`, `speakers`, `reviews`, `philosophy`, `quotes`,
  `closing`, `faq`.
- `description` requires at least one `#` title line.
- FAQ is a flat list of FAQ slugs, no categories.
- Inline `**bold**` and `*italic*` are allowed only in text fields such as tariff
  descriptions, included/received lists, and block descriptions.

## Reference IDs

`common_content.md` is the only source for reference-block identifiers. The
identifier is the bold text before `—` in each entry. Copy it exactly.

If an entity is missing from `common_content.md`, do not invent it. Ask the user
to create it in Studio and export `common_content.md` again, or leave the block
empty only after making the behavior clear.

## Studio vs CLI

- Studio `Создать лабу из MD` creates a new lab and blocks duplicate slugs,
  including drafts.
- Studio `Обновить из MD` updates the currently open lab only when the file slug
  matches the open lab slug; an empty new lab can be filled if the file slug is
  free.
- Studio parse calls use `allowMissingRefs: true`, so missing refs surface as
  warnings in the console/toasts.
- CLI `npm run import-lab` fails on missing refs by default and has an explicit
  `--allow-missing-refs` option.

## Final Self-Check

- Frontmatter is present and valid.
- Slug is unique and lowercase Latin/digit/hyphen.
- `description` has a title.
- Reference identifiers exactly match `common_content.md`.
- Reference blocks that should be specific are not empty.
- No duplicate identifiers.
- Each tariff has a confirmed `product_code`.
- Formatting appears only in text fields.
- FAQ is flat.
- The agent instruction block contains no line that starts with a real `##`
  section heading before `## hero`.
