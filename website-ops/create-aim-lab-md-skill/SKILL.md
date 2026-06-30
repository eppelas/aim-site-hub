---
name: create-aim-lab-md
description: Generate, validate, or explain AIMindset Sanity lab Markdown imports. Use when the user asks to create/update a lab MD file from `create-lab-from-md.md`, work with `common_content.md` reference identifiers, prepare pricing `product_code` values, import/export labs through Sanity Studio or CLI, or explain how Sanity CMS, Astro, staging, payment, and the AIM Site Hub lab-content pipeline connect.
---

# Create AIM Lab MD

## Core Rule

Treat the lab Markdown file as an import contract for Sanity CMS. Read the full
template and the fresh `common_content.md` before generating or validating a
lab. Do not infer reference IDs, product codes, dates, or missing business
content.

## Source Order

1. Prefer user-provided files for the current task:
   - `create-lab-from-md.md`
   - `common_content.md`
2. If working inside the AIM Website repo and no template was attached, use the
   canonical template at `Site Repo - ai-mindset-website/docs/guides/create-lab-from-md.md`.
3. For reference IDs, only use a fresh `common_content.md` exported from Studio.
   If it is missing or could be stale, stop and ask the user to export it again
   with the Studio button `Экспорт общего контента`.

## Generate A Lab MD

1. Read the template instructions completely, especially the agent instruction
   block between frontmatter and the first `## hero`.
2. Confirm enough lab input exists: theme/name, unique slug, start/end dates,
   duration, speakers, cases, tariffs, each tariff `product_code`, quotes,
   reviews, FAQ IDs, and any previous lab URL/source if this is an iteration.
3. Fill frontmatter with `name`, `slug`, `startDate`, `endDate`; dates must be
   `YYYY-MM-DD`, and `slug` must be lowercase Latin/digit/hyphen.
4. Write inline blocks directly: `hero`, `description`, `pricing`, `program`.
   `description` must contain at least one `#` title line.
5. Fill reference blocks only with exact identifiers from `common_content.md`:
   `cases`, `speakers`, `reviews`, `philosophy`, `quotes`, `closing`, `faq`.
   Preserve case, spaces, punctuation, and spelling.
6. Use only product codes confirmed by the user or Dan's NocoDB catalog. Never
   derive a `product_code` from the page slug.
7. Run the template's self-check before returning the file.
8. When asked to output the file, return the complete Markdown as one fenced code
   block and no partial snippets.

## Explain Or Wire The Pipeline

For system explanations, hub copy, onboarding notes, or agent handoff docs, read
the relevant reference files instead of relying on memory:

- `references/lab-md-import-workflow.md` for the MD format, Studio buttons, CLI,
  and no-guessing rules.
- `references/sanity-astro-payment-map.md` for Sanity, Astro, payment, staging,
  and deploy connections.
- `references/sanity-api-access.md` for local API/env access and import/export
  commands, including the clean Sanity CLI bootstrap route.

## Failure Conditions

Ask the user instead of proceeding when:

- `common_content.md` is absent or not clearly fresh;
- product codes are missing or only guessed from a slug;
- several Sanity identifiers could match the user's shorthand;
- the requested lab content is underspecified;
- a previous lab/source page is referenced but cannot be inspected.

If a referenced Sanity entity does not exist in `common_content.md`, say that it
must be created in Studio and `common_content.md` re-exported, or leave that
reference block empty only when the user accepts the import behavior.
