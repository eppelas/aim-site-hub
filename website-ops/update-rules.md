# AIM Website Update Rules

This document explains what updates automatically, how often it updates, which agent owns it, and which rules control it.

Structured source: `website-ops/update-rules.json`

## Update Cadence

| Surface | Owner agent | Cadence | Trigger | Output |
| --- | --- | --- | --- | --- |
| Product rules and Website Hub sync | `AIM Website Product Rules Sync Watch` | Daily at 09:00 Europe/Lisbon | Codex automation `aim-website-product-rules-sync-watch` | Updated product-rule registry, markdown, hub summary, task canvas |
| Case source fidelity review | `Case Source Fidelity Reviewer` | Before every new or materially updated case study handoff | Manual Codex work, case-source update, YouTube fragment extraction, or user-provided case notes | Verified case task, description, tools, result, media notes, and clean screenshots/portrait |
| Production/staging QA dashboards | `AIM Site Agent Evaluation` | Manual; biweekly Monday 07:00 UTC on even ISO weeks; monthly day 1 at 08:00 UTC | GitHub Actions `site-qa.yml` | `reports/latest/*`, `reports/history/*`, GitHub Pages dashboard |
| DeviceCloud preflight | `AI Mindset Device Cloud QA` | Manual; monthly day 2 at 09:00 UTC | GitHub Actions `device-cloud.yml` | Job summary now; provider session evidence later |
| Surikat Telegram intake | `Surikat Vasily` | Cloud Run webhook while service is active; local LaunchAgent is rollback only | Telegram webhook to Cloud Run `aim-surikat-vasily` | Telegram reactions/questions, Linear issues, owner-gated LLM site-audit replies |
| Bot operating rules and Website Hub sync | `AIM Site Ops Sync` | On every meaningful bot runtime/behavior change; local preview auto-sync on `/aim-site-hub/` | Manual Codex work or `node local-preview/sync-bot-operating-rules-summary.mjs` | `website-ops/bot-operating-rules.*`, Hub bot-rule cards, task ledger |
| Website Hub refresh | `AIM Site Ops Sync` | On meaningful operational/UI/doc changes; generated summaries refreshed by local preview auto-sync | Manual Codex work or sync scripts | Local hub preview, LAN/mobile preview, task ledger |
| Design feedback evaluation dashboard | `AIM Design Evaluation` | On every explicit design rating/rejection; automated rating evaluator every 4 hours while active; before new design-generation runs | Page Design Lab site rating, Sonya Telegram rating, manual Codex work, or Codex automation `aim-design-rating-evaluator` | Updated design feedback registry, dashboard, generator guardrails, task ledger |
| Surikat Sonya design review bot | `Surikat Sonya` | Nightly candidate scan and daytime DM review delivery when review windows are known | Local catalog publisher, manual `/review`, Cloud Run webhook, or future schedule after night design output | Telegram screenshot cards, 0-10 ratings, GCS catalog/inventory, feedback registry events, Sonya-to-Vasily handoff, Vertex AI / Cloud Storage media path |
| Homepage full design generator | `AIM Homepage Full Design Generator` | Weekly on Monday at 09:40 Europe/Lisbon after initial manual burst | Codex automation `aim-homepage-full-design-generator` | One complete light-theme homepage prototype, README, manifest entry, task ledger |
| AIM Night Design Pursuit | `AIM Night Design Pursuit` | Daily at 00:05 Europe/Lisbon; can work until 06:45 | Codex automation `aim-night-design-pursuit` | Diverse review-only homepage/payment/element designs, manifests, night report, task ledger |
| Homepage element design generator | `AIM Homepage Element Design Generator` | Weekly on Friday at 10:20 Europe/Lisbon after initial manual burst | Codex automation `aim-homepage-element-design-generator` | One focused homepage block/element prototype, README, manifest entry, task ledger |
| Local Codex bug continuation | `Codex automation bug` | Paused while night-design lane is active | Codex app cron automation with prompt `continue this task` | Continued local bug pass, `~/.codex/automations/bug/memory.md`, inbox handoff |
| Tool registry | `AIM Site Ops Sync` | On every new reusable review or design tool | `node local-preview/sync-tool-registry-summary.mjs` or local preview auto-sync on `/aim-site-hub/` | `website-ops/tool-registry.json`, `aim-site-hub.html` grouped tool cards |

## Rules

### Product Rules Sync

- Source of truth is `website-ops/product-rules.json`.
- Human-readable companion is `website-ops/product-rules.md`.
- The hub summary is generated into `aim-site-hub.html` by `node local-preview/sync-product-rules-summary.mjs`.
- If code and registry disagree, the agent must report drift with exact files/lines and ask for owner decision.
- The agent must not invent a new product rule from ambiguous evidence.

### Case Source Fidelity Review

- The case-source rule lives in `website-ops/product-rules.json` under `case-source-fidelity`.
- The reviewer prompt/checklist lives in `website-ops/case-source-fidelity-reviewer.md`.
- Before handoff, a `Case Source Fidelity Reviewer` pass must compare the case against the exact source set: user notes, supplied markdown, transcript, YouTube fragment, screenshots, and links.
- Technology lists must contain only tools evidenced in the exact case source set. Adjacent personal projects or other cases by the same speaker are not valid evidence.
- If a YouTube fragment exists, screenshots should come from relevant video frames and be cropped without browser chrome, OS UI, player controls, or unrelated captions.
- Speaker portraits extracted from YouTube must be separate crops where the person is not visibly cut off.
- Unsupported or ambiguous claims must be removed, marked unverified, or returned to the user as a question.

### QA Dashboard Updates

- `site-qa.yml` can run `health`, `biweekly`, or `monthly`.
- Biweekly scheduled runs use a Monday cron plus an even ISO-week guard.
- Monthly runs do the broader viewport/screenshot sweep.
- High-severity findings currently make the run failed.
- Dashboards are published to GitHub Pages when the workflow runs.

### DeviceCloud Updates

- DeviceCloud is a separate lane from the main QA gate.
- It skips cleanly unless provider secrets exist.
- BrowserStack is the preferred first automation target; LambdaTest/TestMu and Sauce are fallback lanes.

### Surikat Updates

- Surikat’s production owner is Cloud Run service `aim-surikat-vasily` in
  dedicated GCP project `aim-surikat-vasily`; Sonya remains in
  `project-f40c3e3c-0fca-49de-96d`.
- Telegram delivery uses webhook `POST /telegram`; local `getUpdates` polling must stay disabled while the webhook is set.
- Local LaunchAgent `ai.aim.surikat.bot` is rollback only: call Telegram `deleteWebhook`, then enable/bootstrap the LaunchAgent.
- Cloud Run health is `https://aim-surikat-vasily-qpxb4cl6pq-uc.a.run.app/health`.
- Cloud Run uses `/tmp/vasily-state` only as a working copy. Owner-learned
  runtime rules, Metrika lead DM allowlists, chat alias memory, audit logs, and
  pending Linear reports must hydrate from and persist to
  `gs://aim-surikat-vasily-state/vasily/state/`.
- Surikat must answer product/payment questions from `website-ops/product-rules.json`, not from memory.
- Case-related answers and suggested website case edits must respect `case-source-fidelity` instead of importing facts from memory.
- Owner-gated LLM site audits are read-only: they may fetch pages, check links/dates/names, inspect related Labs/sprint pages, and answer in Telegram, but must not edit the site or push code.
- Addressed messages should be classified semantically before action: visual QA/full-pass/audit/check tasks go to task mode, concrete site breakage goes to bug intake, and questions/discussion stay conversational or silent.
- Addressed questions, discussion, and bot-flow critique may use LLM only for final short wording after hard guards and semantic intent classification. The LLM must not accept tasks, create Linear issues, claim screenshots/dashboard files, or invent current QA status.
- Owner tone feedback such as `говори нормально`, `не по-ишному`,
  `по-человечески`, or `без ChatGPT-защиты` updates
  `conversationalReplyStyle` and must not be treated as just another chat
  question.
- Broader owner instructions such as `запомни правило`, `когда я говорю...`,
  or `в следующий раз...` update `ownerRuntimeInstructions` and are injected
  into future conversational and task prompts. They help routing/wording, but
  do not override Metrika DM recipient allowlists, read-only audit limits,
  secrets, Linear, or deploy guards.
- Telegram clickable hidden URLs (`text_link` entities) must count as task URLs; do not rely only on visible text when deciding whether a task has a target URL.
- Telegram voice/audio/video-note attachments must be transcribed through
  Gemini/Vertex before routing; the transcript counts as effective text for URL
  extraction, semantic classification, and private owner context memory.
- URL-backed aliases are part of chat context: if a thread names a linked URL `ai-native` or another clear alias, future owner task commands may use that alias without repeating the URL.
- In Vasily/QA language, `QA сайта` refers to the AIM Site Agent Evaluation dashboard. An ai-native visual QA pass should create a separate AI Native dashboard page and add it to the top choose-site dashboard selector once the local QA/Codex runner is connected.
- When an owner-gated long LLM/QA task is actually accepted, Surikat should immediately reply to the original source-chat message with a short `Принято...`; the final result comes later as a separate message.
- This immediate acceptance reply is only for task-mode work, not normal bug intake.
- Linked Labs/sprint pages must be checked for stale or ending-soon dates, not accepted as fine just because they return HTTP 200.
- Metrika lead DMs are privacy-sensitive: they may go only to explicit
  owner-controlled recipients. The browser-facing `staging.aimindset.org`
  form/payment lead path is Cloud Run service `aim-pay-lead-relay` in
  dedicated Vasily project `aim-surikat-vasily`; it must
  filter `SURIKAT_METRIKA_LEAD_DM_RECIPIENTS` through
  `SURIKAT_METRIKA_LEAD_DM_ALLOWED_USERNAMES` and must not fall back to a generic
  `TELEGRAM_CHAT_ID` when the allowlist is configured. Future in-bot delivery
  code must check `canSendMetrikaLeadDmTo()` before any personal message.
  Payment lead notification pause/resume may also be controlled by configured
  managers, currently Anca/@stavenski and Ira/@Irhen_N, through Vasily's
  durable `metrikaLeadDmDeliveryPaused` state.
- Owner Telegram rule changes, generic owner runtime instructions,
  conversational style feedback, and chat alias memory must persist through the
  Vasily GCS state prefix; if hydrate fails while enabled, the webhook is
  acknowledged without changing behavior.
- Owner-only tuning commands are restricted to Anca/@stavenski.

### Bot Operating Rules Sync

- Source of truth is `website-ops/bot-operating-rules.json`.
- Human-readable companion is `website-ops/bot-operating-rules.md`.
- The hub summary is generated into `aim-site-hub.html` by `node local-preview/sync-bot-operating-rules-summary.mjs`.
- The local preview server auto-runs the bot-rule sync before serving `/aim-site-hub/`, unless `AIM_PREVIEW_AUTO_SYNC_HUB=false`.
- Any meaningful bot runtime, behavior, or architecture change should update `website-ops/bot-operating-rules.json` first, then the relevant bot README/runtime docs, this registry, `rules-and-pipelines.md`, the Hub, and `TASK_VERIFICATION_CANVAS.md`.
- Prefer this Hub/source-of-truth sync path over storing the rule only in a bot prompt or context window.

### Website Hub Updates

- Any new operational rule, automation, dashboard, bot behavior, or source-of-truth change should be visible in the hub.
- Any durable bot runtime/behavior rule should be added to `website-ops/bot-operating-rules.json`; the local preview server auto-syncs the generated hub section on `/aim-site-hub/`.
- Any new reusable website review or design tool should be added to `website-ops/tool-registry.json`; the local preview server auto-syncs the generated hub section on `/aim-site-hub/`, and `node local-preview/sync-tool-registry-summary.mjs` remains the explicit pre-commit/handoff command.
- Any hub UI change needs local desktop and LAN/mobile preview links.
- Static validation should check local links and responsive overflow.
- GitHub push is never automatic.

### Design Feedback Evaluation Dashboard

- Source of truth is `design-feedback-dashboard/data/design-feedback-registry.json`.
- Human-readable rules live in `website-ops/design-feedback-rules.md`.
- The local dashboard route is `/preview/design-feedback-dashboard/`.
- It has three lanes: main homepage design, guided payment page design, and standalone elements/blocks/popups.
- `AIM Design Quality Pursuit` is active: every generated design direction should plausibly score at least `8/10` and match the spirit of AI Mindset before handoff.
- If the agent's own expected rating is below `8/10`, it must iterate, mark the run as failed exploration, or state the exact gap instead of presenting the design as good.
- Any explicit numeric user rating must be appended with artifact path, rating, diagnosis, and generator impact.
- Surikat Sonya Telegram ratings use the full `0-10` scale: `0` is hard reject, `1-3` rejected, `4-6` weak, `7-8` promising, `9-10` strong.
- Sonya also appends each numeric rating to `website-ops/design-generator-feedback-handoff.jsonl` with target generator automation ids and concrete keep/change/avoid/promote instructions.
- AIM Page Design Lab cards show the average score out of `10` across all explicit ratings and reveal individual ratings on hover/focus; missing reviewer scores stay `—`.
- AIM Page Design Lab can write ratings through the local preview endpoint `/__aim_design_rating`; Anca/Sasha/custom site ratings are included in the visible average and retained as generator evidence.
- If an artifact is materially redesigned after rating, set `ratingPolicy.ratingResetAt` in the manifest. Older ratings become historical/stale context, the visible card should show `recheck` until a fresh rating arrives, and `ratingPolicy.needsSonyaRereview` should queue the updated artifact for Anca review through Sonya.
- The automated rating evaluator reads the registry and generator handoff periodically, then updates docs/manifests/task ledgers or queues follow-up design work according to the latest ratings.
- Ratings from `1-3 / 10` become hard avoid rules for later generation.
- Strong negative qualitative feedback without a number is still negative memory and should be tagged `strong-negative`.
- Structure-only wireframes, sitemap diagrams, and information-architecture maps must be hidden from the default AIM Page Design Lab gallery; they are internal planning artifacts, not design candidates.
- Near-duplicate review skins must be hidden from the default AIM Page Design Lab gallery and Sonya review. Payment 02-05 / Topographic-style variants are the current negative example: same payment card and canvas shell with mostly background/accent/ambient changes is not a set of different designs.
- Every new homepage/payment/element review candidate must have a material delta: composition, hierarchy, interaction/motion mechanic, content model, state behavior, or source-mechanic fidelity. If the same shell is intentionally explored, keep at most two variants and record `reviewFocus` / `designDelta`.
- The 2026-05-28 AIM OS/grid homepage direction rejection is active negative memory: do not repeat beige/yellow grid pages, thin bordered system-card rows, monospaced Russian body copy, caps-heavy labels as the reading path, or dense grid/constellation noise under paragraphs.
- AIM OS is a principles/mechanics reference only; homepage and element body copy must use readable proportional typography, high contrast, calm surfaces under text, comfortable line-height, and sensible line lengths.
- Before sending payment design review links, run QA for active-control contrast, black-on-dark text, red CTA/active cards, invented checkout copy, compact input typography, route animation placement, discount behavior, and desktop/mobile overflow.
- Before sending homepage/element design review links, run desktop/mobile screenshot readability QA and hide failed explorations from the default gallery.
- Guided payment page work must cover four states on one canvas: course choice/payment button, bank redirect, payment failed, payment succeeded.
- Missing success/failure payment copy must be marked as a source gap instead of invented as production copy.
- Before any new homepage, payment, or element design run, the agent must read the dashboard registry and apply active negative memory.

### Surikat Sonya Updates

- Source folder: `Bots/Telegram Design Taste Bot - Sonya/`.
- Cloud Run deployment notes live in `Bots/Telegram Design Taste Bot - Sonya/cloud-run/README.md`.
- Sonya sends design-lab screenshots to Anca and Sasha in Telegram DM and records inline `0-10` button ratings into `design-feedback-dashboard/data/design-feedback-registry.json`.
- Curated/scheduled review sends only candidates with `sonyaScore > 5/10`; manual broad review requests may draw from `inventory.json` to inspect unrated candidates, but still use review-only artifacts, pacing, and owner approval/commands.
- Sasha must press `/start` once before Sonya can DM him. On first contact she asks: `Саша, когда ты не заебан работой и готов смотреть сайты, которые я скидываю?`
- Secrets stay outside tracked files: Telegram token in Keychain service `aim_surikat_sonya_bot_token` locally or Secret Manager in Cloud Run; Gemini key in Keychain or local `.env`/Creative Inbox fallback.
- Cloud credits path must use `SONYA_LLM_PROVIDER=vertex` with `VERTEX_PROJECT_ID` inside the credit-linked Google Cloud project. Plain `GEMINI_API_KEY` is only the Gemini Developer API fallback.
- Cloud Run webhook mode exposes `POST /telegram`, `GET /health`, protected `POST /review-queue`, and protected admin/helper endpoints such as `/agent-link`, `/group-intro`, `/scan-candidates`, and `/conversation-log`; do not run Telegram polling and webhook mode at the same time.
- `SONYA_GCS_BUCKET` enables Cloud Storage upload for incoming Telegram media; large Vertex AI audio/video analysis uses the stored `gs://...` URI.
- Cloud Run uses the GCS state mirror for owner/dispatch/log/registry/handoff surfaces. If hydrate fails while enabled, the webhook acknowledges without side effects instead of overwriting durable state from stale local files.
- Cloud Run reads review cards from GCS `catalog.json` / `inventory.json`; the local catalog publisher owns scoring, screenshot capture, stale-lock cleanup, published-only public links, and GCS publication.
- Current live health should expose `mode=webhook`, `genaiProvider=vertex`, `groupChatEnabled=true`, `groupVideoReplyEnabled=true`, `autoReviewEnabled=false`, `requireSendApproval=true`, and `sashaProactiveDmEnabled=false`.
- Runtime Veo is configured but disabled and expired. The repo Dockerfile runtime has `ffmpeg` available, so real Telegram `video_note` output is possible only if the owner explicitly reopens paid generation and health reports `runtimeVeo.ffmpegAvailable=true`; buildpack/source deploys without `ffmpeg` must not enable `sendAsVideoNote`.
- Each rating is passed to the page generators through `website-ops/design-generator-feedback-handoff.jsonl`, including the rated artifact, Pages/local URL, rater, Sonya diagnosis, target automation ids, and the next-design brief.
- Narrow publication exception: Sonya may commit and push review-only design lab artifacts with `sonyaScore > 5` without Anca local review, but may not replace live routes, deploy production/staging replacements, or stage unrelated dirty files.
- Review cards should include `На что смотреть` / `Чем отличается` when the manifest or GCS catalog includes `reviewFocus` / `designDelta`. If a candidate is only a near-duplicate skin, hide it instead of asking for another rating.
- Explicit low owner ratings override Sonya cached self-scores: a candidate rated `<=5/10` by Anca or Sasha is skipped from the curated catalog even if an older background evaluation scored it higher.
- If a candidate has `ratingPolicy.needsSonyaRereview`, Sonya should treat it as a fresh review candidate even when the same artifact had an older rating. Captions should mention that the page was revised and the previous rating is stale context.
- Bug-like design/page feedback is written to `Bots/Telegram Bug Intake Bot - Linear/data/sonya-design-handoff.jsonl` for Vasily instead of creating Linear issues directly.

### Homepage Design Automations

- Homepage design work is review-only until a human explicitly decides to port a prototype into the React site.
- The content source is `https://aimindset.org/`; `LabW26PageV3` is a lab-page reference, not the homepage source of truth.
- The structure source is `website-ops/homepage-design-brief.json`: every full-page concept must cover all 13 MVP homepage blocks.
- The design reasoning preflight is `website-ops/design-curriculum-reference-pack.md`.
- The feedback preflight is `design-feedback-dashboard/data/design-feedback-registry.json` plus `website-ops/design-generator-feedback-handoff.jsonl`: active rejected ratings and Sonya next-run instructions must affect the next run.
- The quality target is `8+/10`; each generated design should include an internal self-check against the AIM Design Quality Pursuit criteria before handoff.
- The Stas Leto School lesson files in that pack are internal reasoning references only: use them for curation, project argumentation, visual codes, information clarity, accessibility, composition, storytelling, UI/product, and brand-system logic; do not copy lesson text into AIM prototypes.
- The full-page automation writes to `V3 Site Repo - aimwebsite0.5/homepage-design-lab/runs/full/<timestamp-slug>/`.
- The element automation writes to `V3 Site Repo - aimwebsite0.5/homepage-design-lab/runs/elements/<timestamp-slug>/`.
- The page-design index also reads `V3 Site Repo - aimwebsite0.5/payment-page-design-lab/manifest.json`, so payment page directions appear alongside homepage directions as page cards.
- Payment pages and payment popups are separate: `payment-page-design-lab` variants can appear in AIM Page Design Lab, but `payment-popup-compare.html` variants must not be added as page cards.
- After adding or updating homepage, element, or payment page variants, refresh screenshot thumbnails with `node "V3 Site Repo - aimwebsite0.5/homepage-design-lab/scripts/capture-page-design-previews.mjs"`.
- The first manual burst created multiple variants for quick review; recurring automation should stay rare by default to avoid unnecessary local machine load.
- Each run must include `index.html`, `README.md`, and a manifest update with sources, idea, what was borrowed formally, and what was not copied.
- Visual references can include AIM Site Hub, AIM OS, health/selfdev pages, Style Gallery, Blocks Lab, Creative Taste Bot generated animations, Art of Noise by Associate Studio / Cooper Hewitt, and compact external design scouting.
- Anca Projects can be used as an owned mechanics reference for mouse-reactive galaxy/starfield backgrounds, especially when a dark immersive payment/CTA canvas needs motion without external assets.
- Payment Event Horizon learning: keep the mouse-dependent glow from `AIM Payment Gravity`, but do not repeat simple vertical galaxy sway. The rejected `AIM Event Horizon` was a local 2D approximation, not a Gemini-assisted review and not a direct source port. When the user asks to use owned X26/Anca/Creative Taste Bot code directly, first port the source mechanic 1:1, then adapt the AIM/payment composition around it. X26-derived payment variants should use owned presentation math/code for pointer inertia, depth rotation, strand/bowl/event-horizon motion, and velocity wake. `AIM Payment Gravity` and `AIM Vortex Checkout` are `7.5/10` archive candidates only after a stronger replacement is user-approved.
- Logo motion learning: AIM logo is not locked to white-on-black. Future homepage/payment/element runs can use black-on-transparent, white-on-transparent, inverse split, and disturbed black-field treatments. If a black slab appears behind the logo, it should behave as a purposeful motion/distortion surface rather than a static rectangle.
- Art of Noise is a mechanics reference only: variable typography, disciplined interpretive labels, immersive large-scale type, density/repetition, spatial tension, and sound-to-visual-system logic. Do not copy its assets, layout, typeface, images, or exhibition identity.
- External references are inspiration only: mechanics, rhythm, hierarchy, interaction model, and visual grammar. Do not copy assets, distinctive layouts, or brand-owned text.
- Do not copy visible reference text into AIM prototypes. Slide titles, reference labels, exhibition copy, demo captions, and arbitrary numeric labels must be removed or replaced with source-backed AIM/payment/site copy.
- Do not create fake proof: no review blocks without real reviews, no archive/project cards without real links, and no source-thin homepage that pretends to be complete.
- Before handoff, validate manifest JSON, run paths, screenshot thumbnails, desktop/mobile gallery and compare modes, light-theme readability, iframe loading in compare mode, horizontal overflow, and source fidelity for names, links, CTAs, product labels, and footer/legal/archive references.
- These automations must not commit, push, deploy, or edit live production/staging routes.
- Exception: Surikat Sonya may publish only review-only design lab artifacts to GitHub Pages after `sonyaScore > 5`; this does not authorize live route replacement or unrelated staging.

### AIM Night Design Pursuit

- Source doc: `website-ops/night-design-pursuit.md`.
- Automation: `aim-night-design-pursuit`.
- Owner-approved resource window: `00:00-07:00 Europe/Lisbon`.
- The worker may quit nonessential apps/processes inside that window: Telegram, Obsidian, Pencil, Linear, extra Terminal sessions, stale subagents, and stale local servers not needed for validation.
- It must preserve Codex, needed browser/Arc, OS services, Finder, Yandex Disk/sync services, and active Creative Taste Bot/code-animation automation processes.
- The optional `bug` continuation automation may stay paused.
- It should generate diverse review-only designs across homepage, guided payment page, and standalone element lanes.
- It should not generate many variants of the same page shell with only background/accent/ambient changes. At most two same-shell variants may be kept for comparison, and only if the README/manifest states exactly what changed.
- It should use the whole Vibe Coding folder as inspiration, plus local AIM sources, Style Gallery, Creative Taste Bot, Anca Projects, X26 references, lesson pack, design feedback registry, and current web/GitHub scouting when useful.
- External references are inspiration only: mechanics, hierarchy, motion, interaction model. Do not copy assets, layouts, text, typefaces, logos, or brand identity.
- Every artifact needs a README with sources, borrowed mechanics, what was not copied, self-rating, validation notes, and direct local review links.
- Refresh the shared page-design screenshot index with `node "V3 Site Repo - aimwebsite0.5/homepage-design-lab/scripts/capture-page-design-previews.mjs"` after new homepage, element, or payment page artifacts are created.
- At the end of the run, write `website-ops/night-design-pursuit-latest.md` with a review queue.
- Sonya can consume the review queue, rescore candidates, and send only the above-threshold artifacts to humans.

### AIM Gemini Page Generation Sprint

- Automation: `aim-gemini-page-generation-sprint`.
- Purpose: one-off Gemini-first test for AI Mindset review-only page artifacts.
- Route: Gemini visual scout -> Codex implementation -> local/browser QA.
- It must read the agent route experiment protocol and queue before generating.
- It should prioritize Route B (`gemini_scout_codex_build`) and continue through
  the page/design queue while quiet-window runtime and stop conditions allow.
- It must not shrink the job to one card, one route, or one queued item unless a
  real blocker is documented.
- Use `/Users/viola/All/Yandex.Disk.localized/3 Process/8 Vibe Coding/agent-tools/gemini-web-ui-scout.sh`
  before each open-ended page/UI artifact.
- If Gemini fails, use `/Users/viola/All/Yandex.Disk.localized/3 Process/8 Vibe Coding/agent-tools/web-ui-model-fallback-scout.sh`
  and record the fallback label instead of stopping.
- Do not use Flow as the default visual scout.
- Do not enable Vertex/GenMedia/Veo/Imagen/Lyria or any billable media
  generation from this sprint.
- Outputs and safety rules match the review-only homepage/payment labs: no live
  route replacement, no commit, no push, no deploy.

### Local Codex Bug Continuation

- This is a local Codex automation that lives outside the repo at `~/.codex/automations/bug/`.
- `automation.toml` defines the schedule, workspace, model, and the generic prompt `continue this task`.
- `memory.md` is the readable run journal: it shows what the automation inspected, what it changed, what it verified, and what remained unresolved.
- In practice this automation is a night/maintenance continuation worker for unfinished bug-style threads in the AIM workspace. It is currently optional and can remain paused while the AIM Night Design Pursuit lane is active.
- It is not a source of truth for product rules, QA policy, or site content. Those still live in repo docs such as `website-ops/*.json`, `website-ops/*.md`, Surikat docs, and the QA repo.
- If you need to understand why Codex touched something “by itself”, check `~/.codex/automations/bug/memory.md` first.

### Tool Registry

- Source of truth is `website-ops/tool-registry.json`.
- Human-readable companion is `website-ops/tool-registry.md`.
- The hub section `Инструменты` is generated into `aim-site-hub.html` by `node local-preview/sync-tool-registry-summary.mjs`.
- The local preview server runs the product-rules and tool-registry hub sync scripts automatically before serving `/aim-site-hub/`, unless `AIM_PREVIEW_AUTO_SYNC_HUB=false` is set.
- `kind: review` means compare pages, QA/review dashboards, and local preview surfaces.
- `kind: design` means visual generators, asset-making tools, design references, and visual-language systems.
- A tool card should include route/link, source path, status, area, kind, and owner.
- New tools must be opened once through the hub route before handoff.

## What Is Not Automatic Yet

- Real DeviceCloud sessions are not active until provider credentials and adapter are configured.
- R2/S3 durable history upload is not active until bucket credentials are configured.
- Sanity-aware freshness is not fully active until Sanity project/dataset/token details are provided.
- Design gallery content is not auto-generated by this registry; hub links should be checked when design surfaces change.
