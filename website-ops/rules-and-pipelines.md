# AIM Website Rules And Pipelines

This document explains how product rules should flow into the Website Hub, Surikat docs, QA checks, and payment UI.

## Rule Sources

Canonical product-rule source:

- `website-ops/product-rules.json` for machine-readable checks;
- `website-ops/product-rules.md` for human review;
- `website-ops/update-rules.json` for machine-readable update/cadence rules;
- `website-ops/update-rules.md` for human-readable update/cadence rules;
- `website-ops/bot-operating-rules.json` for machine-readable bot runtime,
  behavior, LLM, and Hub sync rules;
- `website-ops/bot-operating-rules.md` for human-readable bot operating rules;
- `design-feedback-dashboard/data/design-feedback-registry.json` for design ratings, rejected directions, preferred mechanics, and generator guardrails;
- `website-ops/design-feedback-rules.md` for human-readable design feedback rules;
- `website-ops/sonya-cloud-run-architecture.md` for Sonya Cloud Run, Vertex,
  GCS, Telegram webhook, and temporary cloud media-generation runtime rules;
- `Bots/Telegram Design Taste Bot - Sonya/` for Telegram design review delivery and rating intake;
- `aim-site-hub.html` for the Website Hub summary.

Implementation sources that should be watched for drift:

- `V3 Site Repo - aimwebsite0.5/src/components/PricingPaymentPopupDatalineHeader.tsx`;
- `V3 Site Repo - aimwebsite0.5/src/components/LabW26PageV3.tsx`;
- `V3 Site Repo - aimwebsite0.5/homepage-design-lab/**`;
- `V3 Site Repo - aimwebsite0.5/payment-page-design-lab/**`;
- `design-feedback-dashboard/**`;
- `Bots/Telegram Design Taste Bot - Sonya/**`;
- `V3 Site Repo - aimwebsite0.5/public/assets/cases/**`;
- `website-ops/homepage-design-brief.json`;
- `Bots/Telegram Bug Intake Bot - Linear/README.md`;
- `Bots/Telegram Bug Intake Bot - Linear/src/telegram-bug-intake.mjs`;
- `Bots/Telegram Bug Intake Bot - Linear/runtime-options.md`;
- `Bots/Telegram Bug Intake Bot - Linear/cloud-run/README.md`;
- `Site Repo - ai-mindset-website/cloud-run/telegram-lead-relay/**`;
- `AIM Site Agent Evaluation/config/cta-rules.json`;
- relevant QA docs in `AIM Site Agent Evaluation/docs/`.

## Daily Sync Agent

Recommended cadence: daily, morning Lisbon time.

Active Codex automation:

- name: `AIM Website Product Rules Sync Watch`;
- id: `aim-website-product-rules-sync-watch`;
- schedule: daily at 09:00 Europe/Lisbon;
- workspace: AIM Website root;
- publish policy: no GitHub push or deploy.

The daily agent should:

1. Check whether `website-ops/*.md`, `website-ops/*.json`, Surikat docs, payment popup code, or QA docs changed.
2. Extract new or changed rules into `website-ops/product-rules.json`.
3. Update `website-ops/product-rules.md`.
4. Run `node local-preview/sync-product-rules-summary.mjs` to refresh the generated Website Hub summary.
5. Verify the hub locally:
   - `curl -I http://127.0.0.1:5123/aim-site-hub/`;
   - Playwright desktop/mobile smoke for `#rules-pipelines` and no horizontal overflow.
6. If a rule affects checkout, create or update QA expectations in `AIM Site Agent Evaluation`.
7. Update `TASK_VERIFICATION_CANVAS.md`.

## Case Source Fidelity Reviewer

Recommended trigger: every new or materially updated website case before local review handoff.

Reviewer prompt/checklist: `website-ops/case-source-fidelity-reviewer.md`

The case reviewer should:

1. Compare the case against the exact source set: user notes, supplied markdown, transcript, YouTube fragment, screenshots, and links.
2. Verify that the task is the original problem/request, not a rewritten solution summary.
3. Verify that the description, result, role labels, and technology list are supported by the source.
4. Remove or flag tools that came from adjacent personal projects, other cases, or model hallucination. A tool such as WHOOP/WOOP, Plaid, PostgreSQL, Tmux, GitHub, GitLab, hardware, or wearables is valid only if evidenced for this exact case.
5. Treat prehistory/background, Personal OS context, and side-project context as non-current-case evidence: those tools can be mentioned as background, but cannot appear in visible case tools unless the source explicitly ties them to the current task/solution.
6. Sort case tools for human readability: AI models/products and user-facing tools first, code/repository tools next, infrastructure/storage/runtime tools later, hardware/wearables last.
7. For YouTube cases, scrub beyond speaker intros and use only product/workflow/UI/document/board/graph/artifact frames as product screenshots; never use a talking-head frame or first visible frame as a product screenshot.
8. If the product is demonstrated during a video call, keep the speaker webcam thumbnail in the product screenshot as part of the case context.
9. Crop product screenshots to the product/workflow area without browser chrome, OS UI, player controls, timeline bars, or unrelated captions; a webcam thumbnail may overlap the product.
10. Reposition the webcam thumbnail only if it sits on empty background or another otherwise disposable area that should be cropped away; do not generate or reconstruct product UI behind it.
11. If a speaker portrait is needed separately, crop it separately from the YouTube fragment and keep the person uncut and readable.
12. If no product/workflow frame exists, or if the source video does not show the product at all, leave the product screenshot empty or return it to the user as a question instead of filling it with a speaker image.
13. Return unsupported or ambiguous facts to the user as questions instead of publishing them.

## Update Rules

The update cadence and owner-agent map lives in:

- `website-ops/update-rules.json`;
- `website-ops/update-rules.md`.

Current update surfaces:

| Surface | Owner agent | Cadence |
| --- | --- | --- |
| Product rules and Website Hub sync | `AIM Website Product Rules Sync Watch` | Daily at 09:00 Europe/Lisbon |
| Case source fidelity review | `Case Source Fidelity Reviewer` | Before every new or materially updated case study handoff |
| Production/staging QA dashboards | `AIM Site Agent Evaluation` | Manual; biweekly Monday 07:00 UTC on even ISO weeks; monthly day 1 at 08:00 UTC |
| DeviceCloud preflight | `AI Mindset Device Cloud QA` | Manual; monthly day 2 at 09:00 UTC |
| Surikat Telegram intake | `Surikat Vasily` | Cloud Run webhook while service is active; local LaunchAgent is rollback only |
| Bot operating rules and Website Hub sync | `AIM Site Ops Sync` | On every meaningful bot runtime/behavior change; local preview auto-sync on `/aim-site-hub/` |
| Website Hub refresh | `AIM Site Ops Sync` | On meaningful operational/UI/doc changes |
| Design feedback evaluation dashboard | `AIM Design Evaluation` | On every explicit design rating/rejection, every 4 hours by `aim-design-rating-evaluator`, and before new design-generation runs |
| Surikat Sonya design review bot | `Surikat Sonya` | Nightly candidate scan and daytime Telegram DM review delivery |
| Homepage full design generator | `AIM Homepage Full Design Generator` | Weekly on Monday at 09:40 Europe/Lisbon after initial manual burst |
| AIM Night Design Pursuit | `AIM Night Design Pursuit` | Daily at 00:05 Europe/Lisbon; can work until 06:45 |
| Gemini-assisted page generation sprint | `AIM Gemini Page Generation Sprint` | One-off manual sprint in the current quiet window; Gemini scout -> Codex build |
| Homepage element design generator | `AIM Homepage Element Design Generator` | Weekly on Friday at 10:20 Europe/Lisbon after initial manual burst |
| Local Codex bug continuation | `Codex automation bug` | Paused while night-design lane is active |

## Bot Operating Rules Sync

Bot behavior and architecture changes must land in the durable Website Hub
surface, not only in a live bot prompt or a chat context window.

Required order:

1. Update `website-ops/bot-operating-rules.json` as the machine-readable source.
2. Update `website-ops/bot-operating-rules.md` and the relevant bot runtime docs.
3. Run `node local-preview/sync-bot-operating-rules-summary.mjs` or open
   `/aim-site-hub/` through the local preview server so the generated Hub cards
   are refreshed.
4. Update `TASK_VERIFICATION_CANVAS.md` with the current request/status.

For Vasily, long owner-gated LLM/QA tasks and short conversational LLM replies
are separate controls. The task path may crawl pages and then ask the LLM to
summarize evidence; the conversational path only writes final wording after the
semantic intent layer has already decided the message is a question/discussion,
not a bug and not a task.
Telegram voice/audio/video-note inputs are transcribed through Gemini/Vertex
before that split, and the transcript is treated as the effective message text
for routing and owner context memory.

Metrika lead DMs are a stricter privacy gate than normal Telegram replies:
personal messages may be sent only to usernames in the owner-controlled
`metrikaLeadDmAllowedUsernames` / `SURIKAT_METRIKA_LEAD_DM_ALLOWED_USERNAMES`
allowlist. The live browser-facing `staging.aimindset.org` form/payment lead
path is Cloud Run service `aim-pay-lead-relay`; it must also require
`SURIKAT_METRIKA_LEAD_DM_RECIPIENTS` as an explicit `username=chat_id` delivery
map and send only entries that are present in the allowlist. When that allowlist
is configured, the relay must not fall back to a generic `TELEGRAM_CHAT_ID`.
Future in-bot Metrika delivery code must call `canSendMetrikaLeadDmTo()` before
sending a DM. Recipient expansion remains owner-approved; payment lead
notification pause/resume may also be controlled by configured managers,
currently Anca / `@stavenski` and Ira / `@Irhen_N`, through Vasily's durable
`metrikaLeadDmDeliveryPaused` state.

Telegram-learned Vasily behavior must be durable in Cloud Run. Owner commands
that tune rules, add generic `ownerRuntimeInstructions`, change conversational
tone/style, add Metrika recipients, or teach per-thread aliases are written
locally under `/tmp/vasily-state` only as a working copy; production must
hydrate and persist `bot-rules.local.json`, `chat-context.local.json`,
`audit-log.jsonl`, and `pending-linear-reports.jsonl` through
`gs://aim-surikat-vasily-state/vasily/state/`. If GCS hydrate
fails while enabled, Vasily should acknowledge the webhook without changing
behavior instead of overwriting durable state from stale `/tmp` files.

`ownerRuntimeInstructions` are included in future LLM conversational and task
prompts so Vasily can understand owner shorthand and recurring task rules, but
they do not override hard guards such as Metrika DM allowlists, read-only
Telegram audits, secrets, Linear routing, or deploy/push rules.

## Homepage Design Automation

These automations create review-only light-theme HTML prototypes before anything is ported into the React site.

- Target lab: `V3 Site Repo - aimwebsite0.5/homepage-design-lab/`.
- Content source: `https://aimindset.org/`.
- Structure source: `website-ops/homepage-design-brief.json`.
- Design reasoning preflight: `website-ops/design-curriculum-reference-pack.md`.
- Design feedback preflight: `design-feedback-dashboard/data/design-feedback-registry.json`.
- The Stas Leto School lesson files in that pack are internal reasoning references only: use them for curation, project argumentation, visual codes, information clarity, accessibility, composition, storytelling, UI/product, and brand-system logic; do not copy lesson text into AIM prototypes.
- Design references: AIM Site Hub, AIM OS, health/selfdev pages, Style Gallery, Blocks Lab, Creative Taste Bot generated animations, Art of Noise by Associate Studio / Cooper Hewitt, and compact external design scouting.
- Owned mechanics reference: Anca Projects `hero-canvas` galaxy/starfield background can be reused for dark immersive payment/CTA surfaces.
- Art of Noise is a mechanics reference only: variable typography, disciplined interpretive labels, immersive large-scale type, density/repetition, spatial tension, and sound-to-visual-system logic. Do not copy its assets, layout, typeface, images, or exhibition identity.
- `LabW26PageV3` is allowed only as a visual/reference surface from previous design work; it is not the homepage source of truth.
- Full-page runs must cover all 13 blocks: hero, philosophy, ecosystem/products, active programs, formats, cases/reviews, short about, team preview, teams/consulting, space, non-profit, FAQ, footer/legal/archive.
- Element runs should rotate through focused blocks and small site surfaces such as hero, product cards, program blocks, format explainers, reviews/cases, team preview, footer, CTA, and popups.
- The shared page-design index shows homepage full-page directions and payment page directions together with screenshot thumbnails; payment source artifacts still live in `V3 Site Repo - aimwebsite0.5/payment-page-design-lab/`.
- Payment pages and payment popups are separate: do not add `payment-popup-compare.html` variants to the AIM Page Design Lab. Popup compare tools can remain available in other review surfaces.
- After new homepage, element, or payment page variants are added, refresh `homepage-design-lab/assets/previews/` with `node "V3 Site Repo - aimwebsite0.5/homepage-design-lab/scripts/capture-page-design-previews.mjs"`.
- The first manual burst created multiple variants for quick review; recurring automation should stay rare by default to avoid unnecessary local machine load.
- Every run must write `index.html`, `README.md`, and a `manifest.json` entry that names sources, idea, borrowed formal mechanics, and what was not copied.
- Every run that changes visible review artifacts must keep the screenshot gallery current before handoff, unless preview capture is explicitly blocked and noted.
- Every run must apply active rejected ratings and strong negative feedback from the design feedback dashboard.
- Do not create fake proof: no review blocks without real reviews, no archive/project cards without real links.
- Source-fidelity pass is required for copied names, links, CTAs, product labels, and footer/legal/archive references.
- No homepage automation may commit, push, deploy, replace live routes, or write outside `homepage-design-lab` except for the manifest and task ledger.

### Gemini-Assisted Page Generation Sprint

`AIM Gemini Page Generation Sprint` is a one-off manual automation for testing
the Gemini-first route on AIM Website page artifacts.

- Automation id: `aim-gemini-page-generation-sprint`.
- Route: Gemini visual scout -> Codex implementation -> local/browser QA.
- Scout command: `/Users/viola/All/Yandex.Disk.localized/3 Process/8 Vibe Coding/agent-tools/gemini-web-ui-scout.sh`.
- Fallback command: `/Users/viola/All/Yandex.Disk.localized/3 Process/8 Vibe Coding/agent-tools/web-ui-model-fallback-scout.sh`.
- It should prioritize Route B from the agent route experiment queue and keep
  moving through the queue while the quiet-window runtime and stop conditions
  allow.
- It must not stop after one card, one route, or one queued item unless a real
  blocker is documented.
- It must not use Flow as default scout and must not enable Vertex/GenMedia or
  other billable media generation.
- It writes only review-only lab artifacts and the dependent manifests/docs;
  live production/staging routes remain untouched.

## Design Feedback Evaluation Dashboard

The dashboard is the source for taste memory and design steering across three lanes:

- main homepage design;
- guided payment page design;
- standalone elements, blocks, popups, CTA surfaces, cards, and footer work.

Rules:

1. `AIM Design Quality Pursuit` is active: every generated design direction should plausibly score at least `8/10` and match AI Mindset spirit before handoff.
2. If the expected rating is below `8/10`, iterate, mark the run as failed exploration, or state the exact gap instead of presenting it as good.
3. Store every explicit numeric user rating with artifact path, diagnosis, and generator impact.
4. Accept ratings from both Surikat Sonya Telegram buttons and the AIM Page Design Lab local preview endpoint `/__aim_design_rating`.
5. Read `website-ops/design-generator-feedback-handoff.jsonl` before each new design run and respond to Sonya/site-rating keep/change/avoid/promote instructions.
6. Treat `0 / 10` as hard reject and `1-3 / 10` as rejected; convert both into avoid rules, with `0` as the strongest signal.
7. Treat strong qualitative rejection without a number as negative memory until exact rating is supplied.
8. Positive external references affect mechanics and hierarchy only; do not copy assets, layouts, text, typefaces, logos, or brand identity.
9. Guided payment page work must cover four states on one page/canvas: course choice/payment button, bank redirect, payment failed, payment succeeded.
10. Missing payment success/failure copy is a source gap and must not be invented as production copy.
11. Structure-only wireframes, sitemap diagrams, and information-architecture maps are internal planning artifacts; hide them from the default AIM Page Design Lab gallery and do not count them as design candidates.
12. Before sending payment design review links, run QA for active-control contrast, black-on-dark text, red CTA/active cards, invented checkout copy, compact input typography, route animation placement, discount behavior, and desktop/mobile overflow.
13. The 2026-05-28 AIM OS/grid homepage direction rejection is active negative memory: do not repeat beige/yellow grid pages, thin bordered system-card rows, monospaced Russian body copy, caps-heavy labels as the reading path, or dense grid/constellation noise under paragraphs.
14. AIM OS is a principles/mechanics reference only; homepage and element body copy must use readable proportional typography, high contrast, calm surfaces under text, comfortable line-height, and sensible line lengths.
15. Before sending homepage/element design review links, run desktop/mobile screenshot readability QA and hide failed explorations from the default gallery.
16. AIM logo usage is flexible: black-on-transparent, white-on-transparent, inverse split, and disturbed field treatments are valid. Static black rectangles behind the logo should be turned into intentional motion/distortion surfaces when used as a visual feature.
16. Hide near-duplicate review skins: the rejected Payment 02-05 / Topographic cluster reused the same payment card and canvas shell with mostly background/accent/ambient changes, so it is not valid design diversity.
17. Require material deltas for new review candidates: composition, hierarchy, interaction/motion mechanic, content model, state behavior, or source-mechanic fidelity. At most two same-shell variants may remain, and only with explicit `reviewFocus` / `designDelta`.

Surikat Sonya is the Telegram intake for this registry. She sends screenshots
with `0-10` buttons, upserts each rater/artifact pair into `feedbackEvents`, and
writes a second generator handoff event to
`website-ops/design-generator-feedback-handoff.jsonl` so page generators know
what to keep, change, avoid, or promote next. Bug-like design feedback still
goes to Vasily's handoff JSONL instead of Linear.
AIM Page Design Lab cards read this registry too: they show the average score
out of `10` across all explicit ratings and reveal individual scores on
hover/focus, without inferring missing ratings.
When the lab is served through the local preview server, those cards can also
save Anca/Sasha/custom ratings back to the registry and handoff queue. The
automated rating evaluator should periodically inspect those new events and
turn them into concrete design/document follow-up before later generators run.
When an artifact is materially redesigned after rating, its manifest should set
`ratingPolicy.ratingResetAt`. Older ratings remain visible as stale historical
context, but Page Design Lab should show `recheck` until a fresh rating arrives;
Sonya should re-send `ratingPolicy.needsSonyaRereview` candidates to Anca as a
new review card.
Sonya review captions should carry `На что смотреть` and `Чем отличается`
when manifests/catalogs provide that data; if the honest difference is only a
background/accent skin, the candidate should be hidden instead of sent.
For curated catalog selection, explicit low owner ratings override stale cached
Sonya self-scores: anything Anca or Sasha rated `<=5/10` should be skipped
until a materially different replacement exists.

## Agent Route Design Experiment

The AIM / Sonya design lab can run a controlled A/B/C route experiment for
review-only web/UI artifacts.

Canonical protocol:

- `/Users/viola/All/Yandex.Disk.localized/3 Process/8 Vibe Coding/agent-rules/web-ui-agent-route-experiment.md`

AIM queue:

- `website-ops/agent-route-design-experiment.md`
- `website-ops/agent-route-design-experiment-queue.json`

Routes:

- `A / codex_baseline`: Codex designs, implements, and QA-checks.
- `B / gemini_scout_codex_build`: Gemini CLI scouts visual web/UI direction;
  Codex implements and QA-checks.
- `C / claude_builder_codex_qa`: Claude Code produces a bounded plan or
  single-file prototype; Codex adapts and QA-checks.

Rule: for open-ended web/UI visual direction, Gemini CLI is used first because
it is the preferred visual scout, not because of Codex budget. Codex still owns
the final implementation, local preview, browser/mobile QA, and handoff.

The first fair batch is five AIM targets through all three routes: homepage
hero route chooser, programs/ecosystem element, cases/reviews surface, Sonya
design-review card, and four-state payment page concept.

## AIM Night Design Pursuit

Night worker source doc: `website-ops/night-design-pursuit.md`.

The owner-approved quiet window is `00:00-07:00 Europe/Lisbon`. During that window the worker may aggressively free resources by quitting nonessential apps and stale local processes, including Telegram, Obsidian, Pencil, Linear, extra Terminal sessions, stale subagents, and stale dev servers not needed for validation.

It must preserve Codex, the browser/Arc needed for review, OS services, Finder, Yandex Disk/sync services, and active Creative Taste Bot/code-animation automation processes.

The worker should generate diverse review-only artifacts across:

- homepage full-page concepts;
- guided payment page concepts with four states;
- standalone elements, blocks, CTAs, cards, and popups.

It should use the whole `Vibe Coding` folder as inspiration, but every external or local reference must be translated into mechanics, hierarchy, motion, or interaction. Do not copy assets, layouts, text, typefaces, logos, or brand identity. No commits, pushes, deployment, or live-site replacement.

After creating visible review artifacts, it should refresh the shared screenshot index with `node "V3 Site Repo - aimwebsite0.5/homepage-design-lab/scripts/capture-page-design-previews.mjs"` so tomorrow's review starts from scannable cards. It may include full-canvas payment page directions from `payment-page-design-lab`, but not payment popup compare variants.

Narrow exception: Sonya may publish review-only design lab artifacts to GitHub
Pages after `sonyaScore > 5` so full-page review cards have direct links. This
exception does not allow live route replacement, production/staging deployment,
or staging unrelated dirty files.

## Local Codex Bug Automation

This is the local Codex cron entity that can otherwise feel invisible until it touches a repo or leaves a memory trail.

- It lives outside the repo in `~/.codex/automations/bug/`.
- `automation.toml` stores the schedule, workspace, model, and the continuation prompt `continue this task`.
- `memory.md` stores the readable run history: which unresolved task it resumed, what it checked, what it changed, what it verified, and what it handed back.
- In this AIM setup it behaves like a continuation worker for unfinished bug/infrastructure/review threads, not like a source-of-truth registry.
- If you need to understand why Codex touched something “by itself”, check `~/.codex/automations/bug/memory.md` before diving into diffs.

## Surikat Sonya Cloud Runtime

Canonical architecture note:
`website-ops/sonya-cloud-run-architecture.md`.

Sonya's live Telegram owner is the Cloud Run webhook while local polling is
disabled. The local Mac can still prepare design review artifacts and run manual
GenMedia experiments, but Telegram updates should have exactly one owner.

Temporary owner-only Veo generation is allowed only with all of these guards:

- `SONYA_RUNTIME_VEO_ENABLED=true`;
- `SONYA_RUNTIME_VEO_OWNER_ONLY=true`;
- a short `SONYA_RUNTIME_VEO_EXPIRES_AT`;
- daily and per-chat caps;
- GCS ledger mirror in `sonya/state/video-generation-ledger.local.jsonl`.

Cloud Billing budgets are alerts, not hard caps. Treat the runtime TTL and
ledger caps as the operational brake. Until Cloud Run has an `ffmpeg` container,
fresh generated clips are sent as normal Telegram videos; true `video_note`
circles are cached assets or Mac-post-processed outputs.

## Bot Operating Rules

Canonical registry:
`website-ops/bot-operating-rules.json`.

Human-readable companion:
`website-ops/bot-operating-rules.md`.

Hub sync:

```bash
node local-preview/sync-bot-operating-rules-summary.mjs
```

The local preview server also runs this sync automatically before serving
`/aim-site-hub/`, unless `AIM_PREVIEW_AUTO_SYNC_HUB=false`.

Current runtime truths:

- Vasily (`@aim_surikat_bot`) is served by Cloud Run service
  `aim-surikat-vasily` in dedicated GCP project `aim-surikat-vasily`; local
  polling is rollback only. Old Vasily services in the Sonya project are
  rollback only unless webhook/site routing is explicitly moved back.
- Sonya (`@aim_surikat_sonya_bot`) is served by Cloud Run service
  `aim-surikat-sonya` in GCP project `project-f40c3e3c-0fca-49de-96d`; local
  polling should not run while the webhook is active.
- Each Telegram bot has exactly one delivery owner at a time: webhook or
  `getUpdates` polling, never both.
- Vasily classifies addressed messages semantically before acting: visual
  QA/full-pass/audit/check instructions are long task-mode work, concrete site
  breakage is bug intake, and questions or discussion are conversational/silent.
- Telegram `text_link` entity URLs count as task URLs even when the visible text
  only shows a short label such as `ai-native`.
- Vasily keeps conservative URL-backed aliases per Telegram chat/thread: if a
  linked URL is labelled `ai-native` or another explicit name, later owner
  commands can refer to that name without repeating the URL.
- In Vasily/QA wording, `QA сайта` points to the AIM Site Agent Evaluation
  dashboard. AI Native visual QA should become a separate dashboard page linked
  from the top choose-site selector after the local QA/Codex runner is wired.
- Telegram read-only audit commands can fetch/check/report, but they must not
  edit the site or push code.

## Rule Change Policy

Any rule is considered incomplete until all relevant surfaces are aligned:

- product rule registry;
- Website Hub summary;
- Surikat docs/behavior;
- site implementation;
- QA expectation, if testable;
- task ledger.

If a rule exists only in React code, Telegram copy, or a chat message, it is not durable enough.

## Current Known Product Rules

Payment discount stacking:

- Alumni and promo-code discounts do not stack with each other;
- Alumni wins if both are valid;
- crypto/USDT 5% can stack with either Alumni or promo-code discount.

Case source fidelity:

- New or updated cases must be checked against exact source materials;
- YouTube screenshots must be clean video-frame crops;
- speaker portraits from YouTube must be separate, readable crops;
- technology lists must contain only evidenced tools for the exact case.

Homepage design source fidelity:

- `aimindset.org` is the text/link source for homepage prototypes;
- the screenshot/transcript structure defines block order, not final copy;
- external visual references are inspiration for mechanics and hierarchy only;
- review artifacts stay out of the live site until explicitly approved for porting.

See `product-rules.md`.
