# AI Native / Payment Analytics Current Setup

Updated: 2026-06-30

This document describes the current analytics setup that the AIM Website hub should expose.

For the complete domain/counter map, see `website-ops/analytics-surface-map.md`.

## Canonical AI Native / Payment Counter

- AI Native / payment Metrika counter: `106857835`
- Primary domain: `ai-native.aimindset.org`
- Mirror domain in Metrika: `staging.aimindset.org`
- Dashboard: `https://metrica.yandex.com/overview?id=106857835`
- Local rules source: `AI Native Landing Repo - ai-native-landing/docs/analytics/aim-attribution-rules.md`
- Local report helper: `AI Native Landing Repo - ai-native-landing/scripts/aim-metrika-attribution-report.mjs`

This is not the global counter for every AIM surface. In this workstream, it covers the AI Native landing and the payment flow that uses the staging mirror.

## Other Analytics Surfaces

| Surface | Counter / tool | Notes |
| --- | --- | --- |
| Local AIM Site Hub `localhost:5123/aim-site-hub/` | No customer analytics by default | Ops/review surface, not production traffic. |
| AIM report / QA surfaces | Metrika `106376865` for `eppelas.github.io/aim-report/` | Separate reporting counter, not AI Native or payment funnel traffic. |
| Yandex Forms / miniapp counters | `103133203`, `102352499` | Visible to the current token but not part of AIM Website funnel reporting. |

## Site Snippet Behavior

The AI Native landing and `/pay` source use Yandex Metrika with:

- Webvisor enabled;
- clickmap enabled;
- trackLinks enabled;
- trackHash enabled;
- ecommerce dataLayer configured;
- alternative CDN style snippet through `mc.webvisor.org`.

The AI Native landing code also forwards normalized UTM params to payment links so payment-page visits can keep source context.

The payment page source lives in `Site Repo - ai-mindset-website`:

- `src/pages/pay/index.astro` injects `YandexMetrica`;
- `src/components/YandexMetrica.astro` initializes counter `106857835`;
- `src/components/payment/PayCardRoot.tsx` sends `pay_contact_entered` and payment events to counter `106857835`.

## Report Helper

Run from the AI Native landing repo:

```bash
node scripts/aim-metrika-attribution-report.mjs --date1=7daysAgo --date2=today
```

JSON mode for further processing:

```bash
node scripts/aim-metrika-attribution-report.mjs --date1=7daysAgo --date2=today --json=true
```

The helper reads `YM_TOKEN` from the environment or from the macOS Keychain service:

```bash
security find-generic-password -w -s aim-yandex-metrika-ym-token
```

Do not paste the token into tracked docs, tickets, screenshots, or chats.

## Main Goals To Watch

Funnel:

- `ain3_pricing_viewed`
- `ain3_join_clicked`
- `ain3_payment_clicked`
- `apply-click`

CTA and links:

- `ain3_cta_clicked`
- `ain3_link_clicked`
- `ain3_lab_link_clicked`

Engagement:

- `ain3_role_manual_selected`
- `ain3_case_opened`
- `ain3_case_more_clicked`
- `ain3_case_filter_clicked`
- `ain3_route_step_clicked`
- `ain3_schedule_tile_previewed`
- `ain3_schedule_tile_clicked`
- `ain3_faq_opened`
- `ain3_program_details_opened`
- `ain3_speaker_recordings_opened`

## What To Inspect In Metrika

1. Traffic quality by AIM-classified channel, not raw Metrika channel.
2. Funnel: visits -> pricing viewed -> join clicked -> payment clicked.
3. Pricing conversion both from all visits and from pricing viewers.
4. Case, FAQ, schedule, route, and speaker interactions.
5. Webvisor sessions with blank screens, broken rendering, payment hesitation, or confusing scroll/click behavior.
6. Device and region splits, especially Russia and unstable in-app/VPN traffic.

## Payment Lead Fallback

Metrika is for behavior and traffic analytics. Surikat/payment lead relay is a separate fallback for collecting payment-page contact input when checkout/payment handoff loses a Telegram username.

Do not use Surikat DM count as the traffic source of truth. When numbers disagree, compare:

- Metrika goals;
- Webvisor session;
- payment relay readiness/logs;
- Surikat DM delivery state.
