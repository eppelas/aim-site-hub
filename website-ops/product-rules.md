# AIM Website Product Rules

This file is the human-readable product-rule registry for AIM Website operations. The structured source is `product-rules.json`.

## Payment Discount Stacking

Status: active  
Area: payment  
Owner: product  
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
