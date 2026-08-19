# Текущая настройка аналитики AIM Website

Updated: 2026-07-23

Документ описывает текущий контур аналитики, который показывает AIM Site Hub.

Карта доменов и счетчиков: `website-ops/analytics-surface-map.md`.

## Основной счётчик лабораторной воронки / Payment

- AI Native / payment Metrika counter: `106857835`
- Primary domain: `ai-native.aimindset.org`
- Mirror domain in Metrika: `staging.aimindset.org`
- Dashboard: `https://metrica.yandex.com/overview?id=106857835`
- Local rules source: `AI Native Landing Repo - ai-native-landing/docs/analytics/aim-attribution-rules.md`
- Local report helper: `AI Native Landing Repo - ai-native-landing/scripts/aim-metrika-attribution-report.mjs`
- UTM publishing table: `website-ops/utm-link-table.md`

Это не глобальный счётчик всех AIM-поверхностей и не счётчик главной `aimindset.org`. Текущие
подтверждённые поверхности — AI Native landing и общий `/pay` на staging mirror.

Для новых лабораторных лендингов используется тот же счётчик `106857835`, но подключение каждого
лендинга нужно проверить отдельно. Новая лаборатория или тариф не получают новый счётчик и копии
целей. Платёжные события разделяются по `pay_event.product_code`, контактная цель — по
`pay_lead.product_code`; отдельный продуктовый дашборд является сохранённым отчётом/сегментом
внутри общего счётчика.

## Три продуктовых дашборда

| Дашборд | Где живут данные | Фильтр / связь с оплатой | Текущее состояние |
| --- | --- | --- | --- |
| Главная `aimindset.org` | Отдельный счётчик `102211004` | Только главная и её собственные переходы; не смешивать с лабораторной воронкой | Счётчик, Вебвизор и карты установлены на live; текущий API-token не имеет доступа |
| AI Native | Общий лабораторный счётчик `106857835` | Лендинг `ai-native.aimindset.org` + все payment-события с `product_code` из набора `ain3_mainearly`, `ain3_main`, `ain3_teamearly`, `ain3_team` | Лендинг и payment-разметка подтверждены |
| S26 | Тот же общий счётчик `106857835` | Лендинг `/labs-custom/s26/` + payment-события с `product_code=s26_main` | Оплата уже разделяется по коду; на live-лендинге S26 счётчик пока не найден, поэтому полная воронка ещё не работает |

AI Native и S26 — не два новых счётчика. Это два сохранённых продуктовых отчёта/сегмента внутри
`106857835`. Главная `aimindset.org` — действительно отдельный счётчик.

## Что настраивается для каждой новой страницы

На каждом новом лабораторном лендинге один раз нужно:

1. Установить общий счётчик `106857835` с Вебвизором, картой кликов и отслеживанием ссылок.
2. Разметить важные блоки и CTA этой конкретной страницы: идентификатор блока, место кнопки и
   точный `product_code` тарифа. Структура страниц различается, поэтому эта часть не появляется
   автоматически от подключения `/pay`.
3. Передать тариф в оплату как `?product=<product_code>` или `data-product=<product_code>`.
4. Создать/проверить сохранённый продуктовый отчёт по URL лендинга и набору его `product_code`.
5. Провести контрольный путь: лендинг → CTA → `pay_page_loaded` → checkout → provider → completed.

Саму страницу `/pay` для нового тарифа заново размечать не нужно: общие payment-события уже
передают `product_code` и попадают в нужный продуктовый сегмент.

UTM — отдельный слой. Они создаются для каждой публикуемой ссылки/источника (пост, story, бот,
рассылка), а не один раз для страницы и не один раз для тарифа.

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

Общие цели `pay_page_loaded`, `pay_contact_entered`, `pay_checkout_clicked`,
`pay_provider_redirected`, `pay_completed` и `pay_error` созданы в счётчике один раз и не
дублируются для отдельных продуктов. Текущий исходник `/pay` отправляет их с `product_code`;
`pay_completed` отправляется после подтверждённого статуса возврата от провайдера.

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
