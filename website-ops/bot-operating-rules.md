# AIM Bot Operating Rules

## 2026-09-14 · Ops inventory verification

Update: waitlist origin block fixed live in relay revision 00018-7kw; unknown origin403 remains enforced. Two explicitly authorized, clearly marked test leads were sent on 2026-09-14: one API test at 12:06 UTC and one real Google Wild browser-button test at 16:00 UTC. Each returned 3 deliveries and 0 failures. The browser showed success, cleared inputs and re-enabled the submit button; the separate close button also worked. Eight intercepted UI cases across Google/Pages, home/NGO and desktop/mobile passed validation, error/retry and success with zero page errors and no additional leads.

- Scope: AIM bot inventory was read-only, except the two explicitly authorized waitlist tests described above. No other bot commands or test leads were sent. Canonical registries and Hub mirrors are reconciled.
- Vasily and Sonya public health endpoints: HTTP 200. This verifies process availability only; Telegram delivery, Linear issue creation and design delivery were not exercised. The payment relay readiness configuration reports three active recipients and paused=false; it is separate from Tikhon and is not a lead-delivery receipt.
- Tikhon workflow observed successful: [34837509539](https://github.com/ai-mindset-org/surikat-family/actions/runs/34837509539). Its workflow success is not a separate Telegram-delivery proof. Current full-site QA freshness is not inferred from [Metrika pull 34835155265](https://github.com/eppelas/aim-site-agent-evaluation/actions/runs/34835155265); local reports/latest/report.json is dated 2026-07-06. QA→Vasily cloud report handoff remains unverified according to the existing inventory.
- Product-rules watcher, bug continuation, night design and full/element homepage generators are PAUSED in current automation.toml. Existing design-index and Blocks public links return HTTP 200. V3/Sanity, experimental Main and Wild remain distinct surfaces; no CMS migration is claimed.
- Wild checkpoint `370d71b9449eaf2bbfce2c6b49b4e38426cded1e`, parent `abc1304e65bf52ac46c61f2fde3a7be23bb2c8cd`, [release 34837559824](https://github.com/eppelas/aimindset-main/actions/runs/34837559824) succeeded. Root verified all 85 public files and all three Google/public pages; subsequent versions are in the live manifest. Waitlist verification is complete as described above.
- Password 0281 is explicitly authorized for the public Hub under details/summary. No new secret values, keys, personal identifiers or message content were added. Local review: http://localhost:5123/aim-site-hub/ ; phone http://192.168.1.181:5123/aim-site-hub/ .


Structured source: `website-ops/bot-operating-rules.json`.

These rules describe the current operating contract for AIM Website bots and
bot-like workers. The Website Hub renders the same source through
`local-preview/sync-bot-operating-rules-summary.mjs`.

## Обязательная перенастройка Linear

Перед рабочим запуском Суриката Василия нужно переподключить к нужному проекту
Linear. Сейчас маршрут настроен на проект `AIM Website`; замены одного
`LINEAR_API_KEY` недостаточно. Нужно обновить `LINEAR_PROJECT_ID`, проверить
соответствующие `LINEAR_TEAM_ID`, `LINEAR_STATE_ID` и `LINEAR_LABEL_IDS`,
задеплоить конфигурацию и создать тестовый тикет через Telegram. Рабочий поток
можно включать только после проверки, что тестовый тикет попал в правильный
проект, команду, статус и метку.

## Недельная накопительная память

Оба Суриката — Василий (Cloud Run `00019`) и Соня (Cloud Run `00064`) — раз в
семь дней обновляют через Gemini свою накопительную текстовую память. Обновление
запускается лениво: на первом сообщении после истечения срока, в фоне и без
задержки ответа пользователю.

Соня сжимает оценки и разговоры: устойчивые вкусовые паттерны, причины высоких
и низких оценок, направления `keep`/`avoid` и договорённости. Василий сжимает
хвост аудита: повторяющиеся проблемы, созданные Linear-тикеты, стиль общения
владельца, постоянные просьбы и ложные срабатывания.

Сводка остаётся примерно в пределах 2K символов и добавляется в основные
рабочие промпты. При каждом обновлении прошлая сводка передаётся Gemini как
основа: память накапливается, а не строится заново только из свежего хвоста.
Если память расходится с текущим сообщением, приоритет всегда у текущего
сообщения.

## Current Bots

- **Surikat Vasily** (`@aim_surikat_bot`) is the QA/Telegram/Linear dispatcher.
  Production delivery is Cloud Run webhook `aim-surikat-vasily` in dedicated
  GCP project `aim-surikat-vasily`; local polling is rollback only while the
  webhook is active. The old Sonya-project Cloud Run services are rollback only
  unless the webhook/site secrets are intentionally moved back.
  When he recognizes and actually accepts a long owner-gated LLM/QA task, he
  should immediately reply in the source chat with a short `Принято...`, then
  return later with the completed result. Ordinary bug intake remains quiet:
  reaction, Linear routing, or one clarification question.
  Owner DMs and directly addressed owner messages go through one LLM semantic
  intent prepass before task, conversation, stop/resume control, bug intake, or
  owner-rule handling:
  visual QA/full-pass tasks go to task mode, concrete site breakage goes to bug
  intake, owner pause/resume wording controls the LLM task runner, owner durable
  rule changes persist, and questions or discussion stay conversational or
  silent. This is meaning-based routing, not a narrow task-regexp list; `давай
  сделаем аудит вот этого сайта ...` is a task because it asks Vasily to do
  website QA work.
  A bare URL, UTM link, analytics note, or edited group note is context only. It
  must not start a crawl/audit unless the current message is in DM or directly
  addresses Vasily by reply/mention/name/command and asks him to check, audit,
  review, QA, inspect, or rerun something.
  Edits/retries of the same Telegram source message are deduped, and owner
  stop/pause intent is semantic-first: exact phrases such as `Вась, остановись`
  are fallback examples, while any direct owner message that means "do not
  launch checks now" pauses new LLM checks in that chat/thread for several hours
  unless the owner explicitly resumes or reruns.
  Scope replies to Vasily's own task clarification, such as `всего сайта`,
  continue the pending task instead of becoming chat. Deterministic task
  patterns are fallback only when the LLM intent router is unavailable. In
  owner private chat, the latest accepted site task URL is working context for
  follow-up QA questions, so `ту же самую`, `вот эту`, or device/browser/design
  follow-ups should not trigger a generic "send URL" clarification.
  Telegram voice/audio/video-note messages are transcribed through the
  configured Gemini/Vertex provider before routing. The transcript becomes the
  effective text for URL extraction, semantic task/conversation/bug
  classification, and private owner context memory, so a voice note can accept a
  site audit task without asking the owner to repeat it in text.
  Human coordination replies to a report thread, such as tagging another person
  to proofread copy, must not create a new bug just because the replied-to
  message had a screenshot or bug-like caption.
  For addressed questions/discussion/bot-flow critique, Vasily can use the
  configured Vertex/Gemini provider to write the final short reply. The LLM does
  wording only: it must not accept tasks, create Linear issues, claim dashboard
  screenshots, or invent current QA status.
  Owner tone feedback like `говори нормально`, `не по-ишному`,
  `по-человечески`, `живее`, or `без ChatGPT-защиты` is a behavior-tuning
  command: it updates `conversationalReplyStyle` and future LLM wording instead
  of being treated as just another chat question.
  Broader owner instructions no longer require a fixed `запомни правило`
  phrase: if the semantic intent is an owner rule update, Vasily stores it in
  `ownerRuntimeInstructions`. Those instructions are injected into future LLM
  conversational and task prompts, but they do not override privacy, read-only
  audit, secret, Linear, or deploy guards.
  Leads from Metrika are privacy-sensitive: they may be sent to personal
  Telegram messages only for the explicit owner-controlled allowlist, currently
  `@stavenski`, `@Irhen_N`, and `@dan_named` in production config. This is not
  permission to message arbitrary users. The live browser-facing lead path is
  Cloud Run service `aim-pay-lead-relay` for `https://staging.aimindset.org`
  form/payment leads. It must use a separate
  `SURIKAT_METRIKA_LEAD_DM_RECIPIENTS` `username=chat_id` delivery map and send
  only recipients that are also in `SURIKAT_METRIKA_LEAD_DM_ALLOWED_USERNAMES`.
  Normal live staging/payment delivery has three active confirmed DM recipients
  (`leadDmActiveRecipientCount=3` in smoke docs/tests): `@stavenski`,
  `@Irhen_N`, and `@dan_named`. Dan's private DM route is confirmed by his
  `/start` message to Vasily on 2026-06-22. For owner-approved live/night test windows, temporarily
  narrow relay delivery to owner-only mode and verify `aim-pay-lead-relay` `/readyz`
  reports `leadDmActiveRecipientCount=1` before sending test leads; restore the
  normal map after the window. Successful relay deliveries should write
  `lead_relay_delivered` logs with masked contact, contact hash, delivered
  usernames, and Telegram `messageId` for diagnostics and precise cleanup.
  Manager-scoped pause/resume must be configured with
  `SURIKAT_METRIKA_LEAD_DM_MANAGER_USER_IDS` plus
  `SURIKAT_METRIKA_LEAD_DM_MANAGER_USERNAMES=stavenski,Irhen_N`, so Ira can
  pause/resume payment lead notifications without becoming a full bot owner.
  After deploy, Vasily `/health` should expose
  `audioTranscriptionEnabled=true`, `metrikaLeadDmAllowlistConfigured=true`,
  `metrikaLeadDmAllowlistCount=3`, `metrikaLeadDmManagerCount=4`, and
  `metrikaLeadDmDeliveryPaused=false` in normal delivery mode. Relay `/readyz`
  should expose `leadDmDeliveryMode=dm_recipient_map`,
  `leadDmAllowlistCount=3`, `leadDmRecipientMapCount=3`,
  `leadDmActiveRecipientCount=3`, `leadDmDeliveryPaused=false`,
  `leadDmDeliveryControlSource=vasily/state/bot-rules.local.json`,
  `stateGcsEnabled=true`, and `legacyTelegramChatConfigured=false`.
  Owner Telegram commands that tune behavior must persist through the GCS state
  mirror, not only local Cloud Run `/tmp`. The production prefix is
  `gs://aim-surikat-vasily-state/vasily/state/`; Vasily must
  never write into Sonya's `sonya/state` prefix. This covers owner-updated
  runtime instructions, conversational reply style, Metrika lead DM allowlists,
  per-thread URL alias memory, audit logs, and pending Linear reports. After
  deploy, `/health` should expose
  `stateGcsEnabled=true`, `stateGcsBucketConfigured=true`, and
  `stateGcsPrefix=vasily/state`.
  He keeps conservative per-thread URL alias memory: if a real linked URL is
  labelled `ai-native` or another explicit name, later owner commands can use
  that name without repeating the URL. Alias memory helps only after a direct
  owner task; it is not permission to treat every future link mention as work.
- **Surikat Sonya** (`@aim_surikat_sonya_bot`) is the design-review and taste
  memory bot in separate GCP project `project-f40c3e3c-0fca-49de-96d`. She
  sends review-only design candidates, collects `0-10` ratings, and writes
  generator memory. Cloud Run reads review cards from GCS
  `catalog.json`/`inventory.json`; the local catalog publisher owns scoring,
  bounded missing-preview capture, stale-lock cleanup, and GCS catalog
  publication. Both curated and owner-broad review are hard-gated by Sonya
  policy v2: active manifest status, passed QA and visual audit for the same
  current artifact fingerprint, screenshot, and explicit review focus/delta.
  Manual commands bypass score only; stale legacy GCS records are rejected.
  Unchanged catalogs are not re-uploaded. Live health currently keeps group replies enabled when addressed,
  `autoReviewEnabled=false`, `requireSendApproval=true`, and
  `sashaProactiveDmEnabled=false`. Runtime Veo is configured but disabled and
  expired; the repo Dockerfile runtime has `ffmpeg` available for real Telegram
  `video_note` output if the owner explicitly reopens paid generation. Vasily
  should not be redeployed into Sonya's project except as an explicit rollback.
- **Ownership.** Vasily's Cloud Run runs in the owner's personal cloud on her
  credits; the Telegram token and Linear API key are hers, and deploy is tied to
  her Mac. `ai-mindset-org/surikat-family` holds the code, configs, docs,
  launchd plists, cloud-run README and `env.production.yaml`, and the self-tests.
  Secrets (Secret Manager/Keychain) and local `data/` state (mirrored in GCS) are
  deliberately outside git. If the Mac is lost, the Telegram token is recovered
  through BotFather and everything else from GitHub, Secret Manager and GCS. An
  optional GitHub Action deploy-on-push needs a deploy-SA key in secrets.
- **Сурикат Соня is paused at roughly 80% readiness.** Nothing is broken: her
  premise is to learn the team's shared taste, which requires the team to react
  to what she sends regularly. Her own styling and the research/discovery
  pipelines still need work, and she ran on Gemini/Google Cloud, so restarting
  her elsewhere needs a new billing account. The variant dashboard she produced
  stays useful on its own.
- **Сурикат Тихон — хранитель свежести сайта** — третий сурикат. Пакет лежит в
  `Bots/Website Freshness Bot/`, публичное имя — Сурикат Тихон, техническое имя
  пакета — `website-freshness-bot`; Telegram-username задаётся только через
  GitHub Secrets. Он отвечает не за баги (Василий) и не за дизайн (Соня), а за
  то, остаются ли утверждения сайта правдой: месячная сверка состава команды,
  жизненный цикл набора на лаборатории и дрейф повторяющихся ссылок. Сайт он
  молча не меняет: результат — дедуплицированный change set с источниками и
  датами, а подтверждённая поломка уходит Василию в Linear.
  **Рантайм.** Один workflow `.github/workflows/tikhon-freshness.yml` в 10:00
  Europe/Moscow (cron `0 7 * * *`); понедельничный прогон добавляет недельную
  сводку. Telegram читается через `getUpdates` long polling из того же прогона:
  ни webhook, ни Cloud Run, ни отдельного сервера. Прогоны сериализованы
  concurrency-группой `surikat-tikhon-state`; без секретов workflow сознательно
  пропускает прогон и пишет причину в step summary. Прототип отдельного Cloud
  Run relay (`cloud-run/waitlist-relay/`) остался в репозитории как код, но из
  инструкции запуска убран.
  **Команды.** Только владелец и только в личке: `проверь`, `покажи <id>`,
  `описание <id> <текст>`, `применить <id>`, `отмена <id>`. Сообщения из групп и
  чужих DM игнорируются без ответа. Обычный вопрос («расскажи подробнее, что
  изменится?») не запускает правку: Тихон отвечает разбором активного change
  set — источники, точные действия и следующая безопасная команда. LLM в этом
  контуре не участвует.
  **Запись.** `применить <id>` повторно проверяет фингерпринты источников и
  только после этого разрешает Action создать одну ветку `tikhon/<id>` и один PR
  в `eppelas/aimindset-main`. Merge, deploy, удаление и локальная запись на маке
  недоступны. GitHub App `Surikat Tikhon` установлен только на этот репозиторий
  с правами Contents и Pull requests read/write. Правки ограничены whitelist
  полей: видимость/заголовок/дата верхних карточек и
  заголовок/дата/описание/ссылка/CTA строки «Обучения».
  **Лаборатории.** До появления страницы — только сезон и год («ближайшая
  лаборатория — осень 2026»), точные даты из чата остаются неподтверждёнными
  свидетельствами. После обнаружения страницы (sitemap, внутренняя ссылка,
  маршрут или подтверждённая ссылка из чата) он извлекает название, даты и
  состояние CTA и ставит срок снятия набора: старт плюс семь календарных дней;
  смена даты старта пересчитывает срок. Первым отслеживаемым объектом был S26:
  старт `2026-08-03`, контрольная дата снятия `2026-08-10`. Страницу он не
  удаляет — она может стать текущим потоком, листом ожидания, итогами или
  архивом.
  **Каталог обучения.** Каждая строка «Обучения» — постоянное направление:
  завершённый поток возвращает свою строку в `waitlist`, но не удаляет её.
  Верхние hero-карточки независимы: это две именованные позиции — «сейчас идёт
  набор» (только при опубликованном CTA) и «ближайшие лаборатории» (только при
  подтверждённой будущей записи каталога Learn). Тихон читает module bundle
  публичного каталога `learn.aimindset.org`, отбрасывает завершённые записи и
  проверяет страницу ближайшей будущей лаборатории; сейчас каталог подтверждает
  F26 (5 октября — 1 ноября 2026), CTA остаётся `waitlist`. Health и AI-native
  уже в конфигурации, Product and Design ждёт опубликованного AIM URL. Новая
  страница без уверенной связи с направлением — вопрос владельцу, а не
  выдуманное сопоставление.
  **Waitlist.** Каждый прогон читает HTML живой главной `aimindset-main.web.app`
  и проверяет контракт формы: Telegram обязателен, у каждой кнопки есть
  `data-waitlist-topic` и `data-waitlist-code`, payload Метрики несёт
  `waitlist.topic`, `product_code`, имя поля и частичный ввод, а в счётчике
  лабораторий `106857835` заведены цели `waitlist_input_started` (`599119093`) и
  `waitlist_contact_entered` (`599119094`). Раз в сутки Action выгружает из Logs
  API три последних завершённых московских дня и присылает владельцу только
  новые вводы. Проверка не имитирует заявку посетителя и не отправляет лид через
  Василия. На 18.08.2026 живой HTML всё ещё отдаёт старый relay без полного
  контракта, поэтому Тихон честно сообщает об этой проблеме и не выдаёт
  отсутствие события за отсутствие лида.
  **Состояние.** Защищённая ветка `tikhon-state` (`state/tikhon-state.json`)
  хранит только фингерпринты источников, обработанные update ID, change sets и
  короткий audit-log (500 update ID, 100 change sets, 2000 фингерпринтов, 500
  записей журнала). Токены, тексты сообщений, chat ID, имена и частичные вводы
  туда не попадают. `GITHUB_TOKEN` семейного репозитория пишет только эту ветку;
  токен GitHub App создаётся временно и только под одобренный PR.
  **Статус на 19.08.2026 (проверено по GitHub).** Тихон работает. Все шесть
  секретов настроены 18.08, в тот же день прошло пять успешных прогонов Action
  (19:24–22:17 UTC): он читал Telegram-апдейты владельца, собирал change set,
  отвечал в личку и коммитил состояние в ветку `tikhon-state` — там сейчас три
  change set в статусе `proposed` и три обработанных update ID. PR ещё ни разу не
  создавался: шаги GitHub App пропускаются, пока change set не подтверждён
  командой «применить». В Метрике ноль фингерпринтов — событий waitlist пока нет.
  **Чего не хватает:** расписание не работает. Workflow и код бота живут только в
  ветке `agent/tikhon-github-actions`, а GitHub запускает `schedule` исключительно
  с дефолтной ветки, поэтому ежедневный прогон в 10:00 МСК не срабатывает и все
  запуски пока ручные (`workflow_dispatch`). Чтобы включить расписание, ветку
  нужно влить в `main`. Рабочие чаты он не читает, краулера и LLM у него нет.
  Расхождение: в коде `reviewCadenceDays: 30`, а владелец в описании функционала
  называет 60 дней — интервал сверки команды нужно подтвердить.
- **AIM Site Agent Evaluation** is the black-box QA worker. It checks the site
  read-only and reports findings that Vasily can summarize or route. The link is
  one-way: Vasily reads a finished `report.json`, the QA agent never calls him.
  Today that handoff is broken in production — Cloud Run has no cloud source for
  `report.json` (no `BOT_QA_REPORT_PATH`), so a successful QA run can publish to
  GitHub Pages while Vasily still answers with fallback text. Planned fix: the QA
  runner publishes `report.json` into `vasily-state` and Vasily reads it on
  hydration. QA findings are deliberately not auto-routed to Linear, and one
  `reports/latest/report.json` is overwritten by whichever mode ran last, so
  Vasily cannot choose a per-surface latest.
Adjacent bots outside this registry (Alex's `@aim_partners_bot`, Dan's
onboarding/payment bot `@prod_ai_mind_set_bot`) are documented separately in
`website-ops/adjacent-bots-2026-07.md` — they are not part of the site
QA/design contour.

## Sync Contract

- Source of truth for this page: `website-ops/bot-operating-rules.json`.
- Hub generator: `node local-preview/sync-bot-operating-rules-summary.mjs`.
- Local preview server auto-runs this generator before serving
  `/aim-site-hub/`, unless `AIM_PREVIEW_AUTO_SYNC_HUB=false`.
- Any meaningful bot behavior/runtime change should update:
  `bot-operating-rules.json`, the bot README/runtime docs, `update-rules.*`,
  `rules-and-pipelines.md`, `aim-site-hub.html`, and
  `TASK_VERIFICATION_CANVAS.md`.
- Architecture/rule changes should be written to
  `website-ops/bot-operating-rules.json` first, then propagated to the Hub by
  the sync script or by opening `/aim-site-hub/` in the local preview server.
  This keeps the Hub as the review surface instead of relying on the bot's
  current context window.

## Safety Defaults

- One Telegram delivery owner per bot token: webhook or polling, never both.
- Bot tokens stay in Keychain locally or Secret Manager in Cloud Run.
- Read-only Telegram audit commands must not edit the website or push code.
- Push/deploy still requires the project approval path unless a narrow documented
  exception applies, such as Sonya publishing review-only design lab artifacts.
- Cloud Run LLM mode must not claim that visual QA screenshots or dashboard
  files were created. `QA сайта` refers to the AIM Site Agent Evaluation
  dashboard, and AI Native needs a separate dashboard page plus a selector link
  once the local QA/Codex runner is connected.
