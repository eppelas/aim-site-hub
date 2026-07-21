# AIM Website Product Rules

This file is the human-readable product-rule registry for AIM Website operations. The structured source is `product-rules.json`.

## Payment Discount Stacking

Status: active<br>
Area: payment<br>
Owner: product<br>
Last updated: 2026-05-26

### Rule

Alumni discount and promo-code discount do not stack with each other. If both are valid, Alumni wins.

Either one can stack with the 5% crypto/USDT payment-method discount.

### Current Discounts

| Discount | Rate | Current implementation evidence |
| --- | ---: | --- |
| Alumni | 20% | `TELEGRAM_ALUMNI_DISCOUNT_HANDLES`, currently `aim` / `@aim` |
| Promo code | 5% | `PROMO_CODE_DISCOUNTS`, currently `ponchik` |
| Crypto/USDT payment method | 5% | `selectedMethod === 'usdt'` |

### Stacking Matrix

| Case | Expected result |
| --- | --- |
| Alumni only | 20% off |
| Promo only | 5% off |
| Alumni + promo | 20% off; promo is not added |
| Alumni + crypto/USDT | 20% off, then 5% crypto discount |
| Promo + crypto/USDT | 5% promo discount, then 5% crypto discount |
| Alumni + promo + crypto/USDT | 20% Alumni discount, promo ignored, then 5% crypto discount |

### Current Code Location

`V3 Site Repo - aimwebsite0.5/src/components/PricingPaymentPopupDatalineHeader.tsx`

Current code already follows this policy:

- `appliedDiscountRate` selects Alumni 20% before promo-code 5%;
- `isPromoCodeSuperseded` becomes true when both Alumni and promo are valid;
- USDT pricing applies `0.95` after the selected base discount.
- USDT-only selection still shows a crossed original USDT price, so the 5% method discount is visible before any Alumni or promo discount is entered.

### Surikat Behavior

If asked about discounts, Surikat should answer:

- Alumni and promo-code discounts are mutually exclusive;
- Alumni wins when both Alumni and promo-code are valid;
- crypto/USDT 5% can stack with either Alumni or promo-code discount;
- if checkout totals show a different result, treat it as a payment bug candidate.

### QA Expectations

Payment checks should cover:

- Alumni only;
- promo only;
- Alumni + promo;
- Alumni + crypto/USDT;
- promo + crypto/USDT;
- Alumni + promo + crypto/USDT.

Website Hub should expose this rule in Product Rules and Pipelines.

Surikat docs should link to this rule before answering payment-rule questions.

## Case Source Fidelity

Status: active  
Area: cases  
Owner: content  
Last updated: 2026-05-26

### Rule

New or updated case studies must be built from the exact provided sources. YouTube fragments require clean video-frame screenshots, source-matched task and description copy, and an explicit source-fidelity review of technologies before handoff.

### Source Policy

- Use the exact source set for the case: user notes, supplied markdown, transcript, YouTube fragment, screenshots, and links.
- When a YouTube fragment exists, verify the task, description, result, tools, roles, and claims against the video or transcript before publishing.
- Do not import facts, tools, or project details from another case by the same person unless the provided source explicitly says they belong to this exact case.
- If the source is ambiguous or the evidence is missing, mark the item as unverified and ask the user instead of filling the gap from memory.

### Technology Policy

- List only technologies that are explicitly named in the exact case sources or directly visible in the case media.
- Do not include tools such as WHOOP, WOOP, Plaid, PostgreSQL, Tmux, GitHub, GitLab, hardware, or wearables unless they are evidenced for this case.
- Keep the technology list understandable for humans: AI models/products and user-facing tools first, code/repository tools next, infrastructure/storage/runtime tools later, hardware/wearables last.
- A technology that appears in a personal side project or adjacent discussion is not valid evidence for the current case.
- A technology that appears only as prehistory/background, Personal OS context, or a side project must not be shown in the visible tools list for the current case. Put it in a background note or ask the user.

### YouTube Media Policy

- If the case has a YouTube fragment, take screenshots from the YouTube video frame whenever those frames are relevant.
- Product screenshots must show the actual product, workflow, UI, document, board, graph, or artifact from the case.
- Do not use a speaker intro, talking-head frame, portrait, or the first visible frame of the fragment as a product screenshot.
- If the product is demonstrated during a video call, keep the speaker webcam thumbnail in the product screenshot as part of the case context.
- It is acceptable for the webcam thumbnail to overlap part of the product screenshot.
- The webcam thumbnail may be cropped separately and repositioned only if it sits on empty background or another otherwise disposable area that should be cropped away; do not generate or reconstruct product UI behind it.
- Scrub through the fragment beyond the intro before deciding there is no product frame; if no product/workflow frame exists, do not add a product screenshot and ask the user if needed.
- If the source video does not show the product/workflow at all, do not add a product screenshot.
- Crop screenshots to the meaningful product or workflow area. Remove browser chrome, OS menu bars, docks, player controls, timeline bars, unrelated captions, and computer UI unless those elements are the subject of the case.
- If the case card or popup needs a speaker image, crop a separate portrait from the YouTube fragment and keep the speaker's face/body uncut and readable.
- Do not use a blurry, partially cut, or irrelevant frame if a clearer frame exists in the fragment.

### Review Agent

Before publishing or handing off any new or materially updated case study, run a `case-source-fidelity-reviewer` pass.

Reviewer prompt/checklist: `website-ops/case-source-fidelity-reviewer.md`

The reviewer checks:

- task is supported by the source and written as the original business/user problem, not as a solution summary;
- description matches what the speaker or supplied notes actually say;
- technology list contains only evidenced tools and is ordered by human relevance;
- screenshots and speaker portrait are cleanly cropped from relevant source frames;
- case structure is understandable: task, solution, tools, result, and media do not contradict each other;
- any unsupported or ambiguous claim is removed, marked unverified, or returned to the user as a question.

### Current Code Location

`V3 Site Repo - aimwebsite0.5/src/components/LabW26PageV3.tsx`

Community Night case media assets live under `V3 Site Repo - aimwebsite0.5/public/assets/cases/` when extracted for the site.

### QA Expectations

- Every new or materially updated case should have a Case Source Fidelity Reviewer pass before local review handoff.
- For YouTube-sourced cases, reviewer notes should explicitly confirm screenshots, speaker portrait, transcript/video claims, and technology list evidence.
- Website Hub should expose this rule in Product Rules and Pipelines so future agents can find it.

## Payment Display Equals Charge

Status: active<br>
Area: payment<br>
Owner: product<br>
Last updated: 2026-07-16 (decided 2026-06-05/06, aim payment gates chat)

### Rule

The price shown by `discount-check` (preview) and the amount actually charged by
`checkout-init`/invoice must be computed from the same FX rate and the same
discount chain. Rounding happens once, at the very end: RUB and USDT to whole
units, no intermediate rounding.

- Providers: Stripe (EUR), Moneta/PayAnyWay (RUB, SBP/QR), OxaPay (USDT), plus
  manual invoice for custom deals.
- RUB is computed at runtime as `price_eur × eur_rub_rate` (rate lives in NocoDB
  config); there is deliberately no `price_rub` in the catalog.
- USDT is indicative and shown with `≈`: OxaPay converts EUR to crypto at
  invoice time.
- `discount-check` returns `amounts: {eur, rub, usdt}` (base + final per
  currency).

### QA Expectations

- For any product code, preview amounts must match what each provider actually
  charges after the same discounts.
- Rounded values appear only once at the end of the chain.

## Tariff Switchover Keeps Both Tariffs Live

Status: active<br>
Area: payment<br>
Owner: product<br>
Last updated: 2026-07-16 (decided 2026-07-07 after the payment outage incident)

### Rule

When switching a lab from an early tariff to the main tariff, enable the new
tariff and keep the old one enabled in parallel. Never disable the old tariff
before the new one is confirmed live — during the 2026-07-07 switch payments
went down while ads were running. Early tariffs may stay enabled indefinitely;
latecomers who deserve early pricing are handled manually by Ira.

### QA Expectations

- During any tariff switch at least one payable tariff for the lab returns a
  valid price from `discount-check`.
- Re-run the purchase path immediately after any tariff config change in NocoDB.

## Product Codes Come From NocoDB, Not Sanity

Status: active<br>
Area: payment<br>
Owner: product<br>
Last updated: 2026-07-16 (decided 2026-05-27 / 2026-06-18, aim payment gates chat)

### Rule

`product_code` is `{lab_slug}_{tariff}` in lowercase (`s26_main`,
`ain3_mainearly`). The source of truth for prices, tariffs, and validity windows
is the NocoDB LMS Lab Config table (Dan) — not Sanity and not the page slug.
Codes are never derived or invented.

- Early-bird is a tariff with `valid_until`, not a promo code; while early is
  active the main price is hidden as `admin_only`.
- Corporate/team deals are not automated on the site: the button leads to
  Telegram and Ira handles contracts and transfers manually.

### QA Expectations

- Every product_code used on a page or in a lab MD import exists in NocoDB Lab
  Config (`site-list-products` / `discount-check` confirm it).
- Tariff-code lookup should be case-insensitive end to end; until the n8n root
  fix is confirmed, catalog keys stay lowercase.

## Testimonial Consent Is Site-Only

Status: active<br>
Area: content<br>
Owner: content<br>
Last updated: 2026-07-16 (decided 2026-06-10, AI Mindset {site} chat, Irina)

### Rule

Testimonials collected in 2026 are approved for the website only (ai-native
set); using them anywhere else requires fresh consent. Case studies were cleared
by Vlada for marketing in general and may be used more widely. Raiffeisen must
not be named in a testimonial — describe as "Financing + company size"; the logo
may appear on the site only without matching it to a testimonial or a person's
name.

### QA Expectations

- No testimonial from the site set appears in emails, decks, or ads without
  recorded new consent.
- No page visually links the Raiffeisen logo to a specific testimonial or name.

## Staff and Agents Excluded From Analytics

Status: active<br>
Area: analytics<br>
Owner: product<br>
Last updated: 2026-07-16 (decided 2026-07-01, AI Mindset {site} chat, Anya)

### Rule

Everyone working on the site — and every browser their agents drive, including
Playwright profiles — must self-exclude from analytics by opening the staff
links once:

- `https://ai-native.aimindset.org/?aim_staff=on`
- `https://staging.aimindset.org/pay/?product=ain3_mainearly&aim_staff=on`

The cookie lasts 180 days and must be refreshed after profile resets.

### QA Expectations

- QA/bot browser profiles set `aim_staff=on` before crawling prod or staging.
- Metrika sessions from team devices and agent runs stay out of funnel numbers.

## Agents Get Read-Only Sanity Access

Status: active<br>
Area: cms<br>
Owner: tech<br>
Last updated: 2026-07-16 (decided 2026-07-01/02/09, AI Mindset {site} chat, Rakitin)

### Rule

AI agents working with Sanity receive read-only tokens; Admin roles are held
only by Sergei Rakitin and the team account. Agents must never modify the Sanity
schema (guardrails: `docs/guides/vibecode-lab-site-guardrails.md` in the
ai-mindset-website repo). Vibecode lab sites bound to Sanity data live inside
the ai-mindset-website repo under `src/pages/labs-custom` — not in separate
repos — so publish webhooks keep working. Free-standing vibecode sites stay out
of the main site repo.

### QA Expectations

- Sanity access review: only Rakitin + team account hold Admin; agent tokens are
  read-only.
- New vibecode lab pages appear under `staging.aimindset.org/labs-custom/*` and
  update on Sanity publish.

## New Site People and Entities Are Announced

Status: active<br>
Area: process<br>
Owner: team<br>
Last updated: 2026-07-16 (decided 2026-06-30, AI Mindset {site} chat, Anya)

### Rule

Any new person, agent, repo, service, or input that touches the site surface
(staging, Sanity, aimindset.org, analytics, QA tests, payments, branding) must
be announced in the site chat before or as it appears. Adopted after agent
OXI-717 (Ilya Golubev) was discovered in the staging repo without prior
introduction; the Ilya↔Rakitin sync happened 2026-07-09.

### QA Expectations

- Every new collaborator or agent with repo/Sanity/analytics access maps to an
  introduction message in the site chat.
- Hub registries (bots, tools, rules) are updated when such an entity becomes
  permanent.
