# AI Native / Payment Analytics Surface Map

Updated: 2026-06-30

This is the source-of-truth map for the analytics surfaces currently in scope for the AI Native / payment / staging work.

Out of scope for this map: other/unrelated production analytics surfaces. Do not add unrelated counters here until the owner explicitly asks for that workstream.

## Surface Map

| Surface | URL / route | Analytics | Access from current token | Local source / owner | Status |
| --- | --- | --- | --- | --- | --- |
| AI Native landing | `https://ai-native.aimindset.org/` | Yandex Metrika `106857835` (`ai-native`) | Yes, `edit` | `AI Native Landing Repo - ai-native-landing/index.html`, `script.js` | Live HTML confirmed counter `106857835`, Webvisor, alternative CDN |
| AI Native payment page | `https://staging.aimindset.org/pay/*` | Yandex Metrika `106857835` as mirror domain | Yes, `edit` | `Site Repo - ai-mindset-website/src/pages/pay/index.astro`, `src/components/YandexMetrica.astro`, `src/components/payment/PayCardRoot.tsx` | Source configured; Metrika API says `staging.aimindset.org` is a mirror. Local shell live check hit TLS timeout, so browser/live confirmation should be separate |
| Staging root / other staging pages | `https://staging.aimindset.org/` except `/pay/*` | Unknown until each page is checked | `106857835` mirror exists, but page snippet is not guaranteed | `Site Repo - ai-mindset-website` or deployed staging host, depending on route | Do not assume the whole staging domain is tracked just because it is a mirror |
| Local AIM Site Hub | `http://localhost:5123/aim-site-hub/` | No production analytics by default | Not applicable | `aim-site-hub.html`, `local-preview/server.mjs` | Local ops/review surface; should not be mixed with customer traffic |
| AIM Site Hub public mirror | `AIM Site Hub Repo - aim-site-hub` / GitHub Pages if published | No canonical customer analytics currently documented | Not applicable | `AIM Site Hub Repo - aim-site-hub` | Ops documentation surface, not AI Native funnel traffic |
| QA / reports | `eppelas.github.io/aim-site-agent-evaluation/*`, `eppelas.github.io/aim-report/*` | Metrika counter `106376865` exists for `eppelas.github.io/aim-report/` | Yes, `own` | QA/report tooling | Separate reporting surface, not AI Native or payment funnel |
| Yandex form counter | `forms.yandex.ru/cloud/68626950e010db17bd280f08` | Metrika `103133203` | Yes, `own` | Yandex Forms | Not website funnel traffic |
| Miniapp counter | `app.mitrohinayulya.ru` | Metrika `102352499` | Yes, `edit` | External miniapp | Not AI Native or payment funnel traffic |

## Current API Token

The macOS Keychain service `aim-yandex-metrika-ym-token` currently sees:

- `106857835` — `ai-native`, site `ai-native.aimindset.org`, mirror `staging.aimindset.org`, permission `edit`;
- `106376865` — `AIM Report`, site `eppelas.github.io/aim-report/`, permission `own`;
- `103133203` — `Анкета для читателей`, permission `own`;
- `102352499` — `Миниапп`, permission `edit`.

## Practical Rule

Do not say "canonical AIM counter" without naming the surface.

Use:

- "AI Native/payment counter" for `106857835`;
- "ops/report counter" for `106376865`.

When reporting traffic, always state both the domain/page and the counter ID.
