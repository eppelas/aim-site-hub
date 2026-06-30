# AIM Bot Operating Rules

Structured source: `website-ops/bot-operating-rules.json`.

These rules describe the current operating contract for AIM Website bots and
bot-like workers. The Website Hub renders the same source through
`local-preview/sync-bot-operating-rules-summary.mjs`.

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
  Owner DMs, addressed messages, and owner messages with an explicit URL go
  through the LLM semantic intent router before conversational replies:
  visual QA/full-pass tasks go to task mode, concrete site breakage goes to bug
  intake, and questions or discussion stay conversational or silent. This is
  meaning-based routing, not a narrow task-regexp list; `давай сделаем аудит
  вот этого сайта ...` is a task because it asks Vasily to do website QA work.
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
  Broader owner instructions like `запомни правило`, `когда я говорю QA сайта`,
  `теперь считай...`, or `в следующий раз...` update
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
  Normal live staging/payment delivery has two active confirmed DM recipients;
  `@dan_named` stays approved but inactive in the relay until his private DM
  route is confirmed. For owner-approved live/night test windows, temporarily
  narrow relay delivery to owner-only mode and verify `aim-pay-lead-relay` `/readyz`
  reports `leadDmActiveRecipientCount=1` before sending test leads; restore the
  normal map after the window. Successful relay deliveries should write
  `lead_relay_delivered` logs with masked contact, contact hash, delivered
  usernames, and Telegram `messageId` for diagnostics and precise cleanup.
  After deploy, Vasily `/health` should expose
  `audioTranscriptionEnabled=true`, `metrikaLeadDmAllowlistConfigured=true`,
  `metrikaLeadDmAllowlistCount=3`, `metrikaLeadDmManagerCount=4`, and
  `metrikaLeadDmDeliveryPaused=false` in normal delivery mode. Relay `/readyz`
  should expose `leadDmDeliveryMode=dm_recipient_map`,
  `leadDmAllowlistCount=3`, `leadDmRecipientMapCount=2`,
  `leadDmActiveRecipientCount=2`, `leadDmDeliveryPaused=false`,
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
  that name without repeating the URL.
- **Surikat Sonya** (`@aim_surikat_sonya_bot`) is the design-review and taste
  memory bot in separate GCP project `project-f40c3e3c-0fca-49de-96d`. She
  sends review-only design candidates, collects `0-10` ratings, and writes
  generator memory. Cloud Run reads review cards from GCS
  `catalog.json`/`inventory.json`; the local catalog publisher owns scoring,
  bounded missing-preview capture, stale-lock cleanup, and GCS catalog
  publication. Live health currently keeps group replies enabled when addressed,
  `autoReviewEnabled=false`, `requireSendApproval=true`, and
  `sashaProactiveDmEnabled=false`. Runtime Veo is configured but disabled and
  expired; the repo Dockerfile runtime has `ffmpeg` available for real Telegram
  `video_note` output if the owner explicitly reopens paid generation. Vasily
  should not be redeployed into Sonya's project except as an explicit rollback.
- **AIM Site Agent Evaluation** is the black-box QA worker. It checks the site
  read-only and reports findings that Vasily can summarize or route.

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
