# Текущая настройка аналитики AIM Website

Updated: 2026-06-30

Документ описывает текущий контур аналитики, который показывает AIM Site Hub.

Карта доменов и счетчиков: `website-ops/analytics-surface-map.md`.

## Основной счетчик AI Native / Payment

- AI Native / payment Metrika counter: `106857835`
- Primary domain: `ai-native.aimindset.org`
- Mirror domain in Metrika: `staging.aimindset.org`
- Dashboard: `https://metrica.yandex.com/overview?id=106857835`
- Local rules source: `AI Native Landing Repo - ai-native-landing/docs/analytics/aim-attribution-rules.md`
- Local report helper: `AI Native Landing Repo - ai-native-landing/scripts/aim-metrika-attribution-report.mjs`
- UTM publishing table: `website-ops/utm-link-table.md`

Это не глобальный счетчик всех AIM-поверхностей. В этом workstream он покрывает AI Native landing и payment flow, который использует staging mirror.

## Другие аналитические поверхности

| Поверхность | Счетчик / инструмент | Заметки |
| --- | --- | --- |
| Local AIM Site Hub `localhost:5123/aim-site-hub/` | No customer analytics by default | Ops/review surface, not production traffic. |
| AIM report / QA surfaces | Metrika `106376865` for `eppelas.github.io/aim-report/` | Separate reporting counter, not AI Native or payment funnel traffic. |
| Yandex Forms / miniapp counters | `103133203`, `102352499` | Видны текущему token, но не входят в AIM Website funnel reporting. |

## Как установлен код счетчика

AI Native landing и `/pay` source используют Яндекс Метрику с:

- Вебвизором;
- clickmap;
- trackLinks;
- trackHash;
- ecommerce dataLayer;
- alternative CDN style snippet through `mc.webvisor.org`.

AI Native landing code также прокидывает normalized UTM params в payment links, чтобы payment-page visits сохраняли source context.

Staff-mode включается служебной ссылкой `?aim_staff=on` и пишет cookie/localStorage
на 180 дней. `?aim_staff=off` очищает маркер. В Метрику, payment goals и Surikat
relay прокидывается `traffic_type=internal|external`; командные визиты надо
исключать из продуктовых отчетов до чтения конверсии и источников.

Перед публикацией каждая внешняя AI Native/payment ссылка должна попасть в `website-ops/utm-link-table.md`.

Payment page source живет в `Site Repo - ai-mindset-website`:

- `src/pages/pay/index.astro` injects `YandexMetrica`;
- `src/components/YandexMetrica.astro` initializes counter `106857835`;
- `src/components/payment/PayCardRoot.tsx` sends `pay_contact_entered` and payment events to counter `106857835`.

## Локальный отчет через API

Run from the AI Native landing repo:

```bash
node scripts/aim-metrika-attribution-report.mjs --date1=7daysAgo --date2=today
```

JSON mode for further processing:

```bash
node scripts/aim-metrika-attribution-report.mjs --date1=7daysAgo --date2=today --json=true
```

Helper читает `YM_TOKEN` из environment или из macOS Keychain service:

```bash
security find-generic-password -w -s aim-yandex-metrika-ym-token
```

Не вставлять token в tracked docs, tickets, screenshots или chats.

## Основные цели

Воронка:

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

## Что смотреть в Метрике

1. Сначала исключить `traffic_type=internal`, если отчет про реальных пользователей.
2. Качество трафика по AIM-классифицированному каналу, а не по raw Metrika channel.
3. Воронка: visits -> pricing viewed -> join clicked -> payment clicked.
4. Pricing conversion from all visits и from pricing viewers.
5. Case, FAQ, schedule, route и speaker interactions.
6. Webvisor sessions с blank screens, broken rendering, payment hesitation или confusing scroll/click behavior.
7. Device and region splits, особенно Russia и unstable in-app/VPN traffic.

## Страховка контактов на оплате

Метрика отвечает за поведение и traffic analytics. Surikat/payment lead relay — отдельная страховка для collecting payment-page contact input, если checkout/payment handoff теряет Telegram username.

Surikat DM count не является source of truth для traffic source. Если цифры расходятся, сравнивать:

- цели Метрики;
- Webvisor session;
- payment relay readiness/logs;
- Surikat DM delivery state.

Surikat lead message now includes `traffic: internal|external|unknown` so staff
tests can be recognized without muting personal delivery.
