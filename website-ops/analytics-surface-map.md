# AIM Website Analytics Surface Map

Updated: 2026-07-23

This is the source-of-truth map for the main homepage and the shared laboratory/payment analytics work.

Out of scope for this map: unrelated production analytics surfaces. Do not add unrelated counters here until the owner explicitly asks for that workstream.

## Surface Map

| Surface | URL / route | Analytics | Access from current token | Local source / owner | Status |
| --- | --- | --- | --- | --- | --- |
| Main homepage | `https://aimindset.org/` | Separate Yandex Metrika `102211004`; live HTML also exposes GA4 `G-BPJ1K4NV2R` and GTM `GTM-WGXR2KP8` | No: current Yandex token returns `403 access_denied` | Production hosting/Super injection; local V3 source does not contain the snippets | Live HTML confirmed Metrika, Webvisor, clickmap and link tracking. Keep separate from laboratory/payment reporting |
| AI Native landing | `https://ai-native.aimindset.org/` | Shared laboratory counter `106857835`; AI Native report filters this landing plus `ain3_*` payment products | Yes, `edit` | `AI Native Landing Repo - ai-native-landing/index.html`, `script.js` | Live HTML confirmed counter `106857835`, Webvisor, alternative CDN |
| AI Native payment page | `https://staging.aimindset.org/pay/*` | Yandex Metrika `106857835` as mirror domain | Yes, `edit` | `Site Repo - ai-mindset-website/src/pages/pay/index.astro`, `src/components/YandexMetrica.astro`, `src/components/payment/PayCardRoot.tsx` | Source configured; Metrika API says `staging.aimindset.org` is a mirror. Local shell live check hit TLS timeout, so browser/live confirmation should be separate |
| S26 landing | `https://staging.aimindset.org/labs-custom/s26/` | Must use shared laboratory counter `106857835`; S26 report filters this URL plus payment product `s26_main` | Counter access: yes, `edit`; landing capture: not active | Vibecode/Sanity custom-lab surface | Live page returned HTTP 200 on 2026-07-23, but its HTML contained no Metrika snippet. Install the shared counter and page/CTA events before treating the S26 dashboard as a full funnel |
| S26 payment slice | `https://staging.aimindset.org/pay?product=s26_main` | Shared payment goals in counter `106857835`, segmented by `pay_event.product_code=s26_main` and `pay_lead.product_code=s26_main` | Yes, `edit` | Shared `/pay` source | Payment events are already product-aware; no S26-specific counter or duplicate payment goals are needed |
| Staging root / other staging pages | `https://staging.aimindset.org/` except `/pay/*` | Unknown until each page is checked | `106857835` mirror exists, but page snippet is not guaranteed | `Site Repo - ai-mindset-website` or deployed staging host, depending on route | Do not assume the whole staging domain is tracked just because it is a mirror |
| Local AIM Site Hub | `http://localhost:5123/aim-site-hub/` | No production analytics by default | Not applicable | `aim-site-hub.html`, `local-preview/server.mjs` | Local ops/review surface; should not be mixed with customer traffic |
| AIM Site Hub public mirror | `AIM Site Hub Repo - aim-site-hub` / GitHub Pages if published | No canonical customer analytics currently documented | Not applicable | `AIM Site Hub Repo - aim-site-hub` | Ops documentation surface, not AI Native funnel traffic |
| QA / reports | `eppelas.github.io/aim-site-agent-evaluation/*`, `eppelas.github.io/aim-report/*` | Metrika counter `106376865` exists for `eppelas.github.io/aim-report/` | Yes, `own` | QA/report tooling | Separate reporting surface, not AI Native or payment funnel |
| Yandex form counter | `forms.yandex.ru/cloud/68626950e010db17bd280f08` | Metrika `103133203` | Yes, `own` | Yandex Forms | Not website funnel traffic |
| Miniapp counter | `app.mitrohinayulya.ru` | Metrika `102352499` | Yes, `edit` | External miniapp | Not AI Native or payment funnel traffic |

## Staff Traffic

For AI Native/payment reports, team checks should be marked with
`traffic_type=internal` through the private `?aim_staff=on` link. The marker is
stored for 180 days per browser/profile/device and can be cleared with
`?aim_staff=off`. Home IP filters are optional backup only, not the primary
exclusion mechanism.

## Current API Token

The macOS Keychain service `aim-yandex-metrika-ym-token` currently sees:

- `106857835` — `ai-native`, site `ai-native.aimindset.org`, mirror `staging.aimindset.org`, permission `edit`;
- `106376865` — `AIM Report`, site `eppelas.github.io/aim-report/`, permission `own`;
- `103133203` — `Анкета для читателей`, permission `own`;
- `102352499` — `Миниапп`, permission `edit`.

The main-site counter `102211004` is installed live but is not available to this token: both
counter-management and report requests return `403 access_denied`.

## Practical Rule

Do not say "canonical AIM counter" or "dashboard" without naming the surface.

Use:

- "main aimindset.org counter" for `102211004`;
- "shared laboratory/payment counter" for `106857835`;
- "AI Native report" for the `ai-native.aimindset.org` + `ain3_*` segment inside `106857835`;
- "S26 report" for the `/labs-custom/s26/` + `s26_main` segment inside `106857835`;
- "ops/report counter" for `106376865`.

When reporting traffic, always state both the domain/page and the counter ID.
