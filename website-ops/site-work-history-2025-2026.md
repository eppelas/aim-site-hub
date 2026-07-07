# История работы над AIM Website — июль 2025 → июль 2026

Собрано 2026-07-07 из git-истории шести репозиториев, локальных данных Суриката Василия
(`Bots/Telegram Bug Intake Bot - Linear/data/audit-log.jsonl`) и QA-отчётов.

## Таймлайн по месяцам

| Период | Что происходило |
|---|---|
| Июл 2025 – Янв 2026 | Затишье: только автообновления пакетов в `ai-mindset-website` (PR #24, #27, #28, #32) |
| Фев 2026 | Реактивация: архитектурная документация, Tailwind CSS v4, удаление TinaCMS, интеграция ai-native sprint landing с тёмной темой |
| Мар 2026 | Закрытие S2-лидов → редиректы на X26/S3 waitlist; порт дизайна Ани (hero, pricing, sidebar, mobile menu); архитектура лабораторий + Sanity Studio; MD import/export pipeline; миграция Sanity на организацию AIMindset; старт V3-репо (18 коммитов) и blocks-репо |
| Апр 2026 | Пик работы над основным сайтом (71 коммит): чистка Sanity-схем под дизайн Ани, seed-данные, типографика, hardcode-cleanup |
| Май 2026 | Появился QA-контур (`AIM Site Agent Evaluation`), боты Сурикат Василий (bug intake → Linear) и Сурикат Соня (design taste), дашборды и Site Hub; Вася в проде с 27 мая |
| Июн 2026 | Самый активный месяц (86 коммитов сайта + 36 в ai-native-landing): выделение AI Native landing в отдельный репо (12.06), подготовка спринта III (старт 13.07), Яндекс.Метрика + альтернативный CDN, UTM-форвардинг в /pay, платёжный контур (multi-seat, product codes, NocoDB), hub на GitHub Pages, Cloud Run деплой Васи и Сони, lead-relay со staging |
| Июл 2026 | Аналитика событий и атрибуция, Sanity content workflow, начат Main Page Redesign 2026-07 |

## Telegram-чаты сайта (данные Василия)

Локальный audit-log покрывает **27.05–12.06.2026** (580 обработанных сообщений, 35 багов ушло в Linear: EPP-109…EPP-141). Chat-context обновлялся до 04.07.

Подключённые чаты:
- `AI Mindset {site}` — supergroup `-1003554591219` (основная группа по сайту)
- `aim payment gates` — group `-5286934106` (платёжный контур)
- `aim pets` — group `-5106876280` (почти неактивна)
- DM с Анкой `@stavenski` (owner-команды)

Главные темы периода:
1. **Платежи** — multi-seat checkout (AIM-4029), связка product code ↔ тарифы NocoDB (AIM-4030, блокер запуска Health Sprint 08.06), сломанный return-url (AIM-4031), пустые/неверные суммы в ₽ и USDT, маппинг Stripe/Moneta/OxaPay.
2. **Таксономия лабораторий** — Main (квартальные ~4 недели), AI Native (периодические), Sprint (2–3 недели); лабы x26, s3, self-dev, health, s26; мастер-таблица NocoDB + план интеграции с Sanity; early-bird против multi-seat прайсинга.
3. **Доступ из России** — aimindset.org и staging недоступны (Cloudflare → RCN бан); обходной путь — серое облако/Timeweb (EPP-141).
4. **CTA и копирайт** — гайдлайны по CTA (EPP-129), порядок доказательств: логотипы/кейсы/отзывы (EPP-135, EPP-136).
5. **Консистентность данных** — расхождения тарифов между сайтом, NocoDB и Sanity; невыделенные early-bird даты.

## Ограничение

Полную годовую историю Telegram-чата бот отдать **не может** — Telegram не даёт ботам
ретроспективный доступ к сообщениям до их подключения/вне окна хранения. Для полного
архива нужен экспорт из Telegram Desktop (Настройки → Advanced → Export chat history)
по группе `AI Mindset {site}`; после экспорта его можно разобрать и дополнить этот файл.
