# Surikat Sonya Cloud Runtime Architecture

Date: 2026-05-28.

This is the shared ops note for how Sonya works when Telegram is owned by
Google Cloud instead of the Mac.

## Runtime Path

```text
Telegram update
  -> Cloud Run service aim-surikat-sonya
  -> src/telegram-design-taste-bot.mjs
  -> deterministic Telegram routes
  -> Vertex AI semantic/media analysis when needed
  -> Cloud Storage state/media mirror
  -> Telegram reply/cards/video
```

Current service:

- Project: `project-f40c3e3c-0fca-49de-96d` (`AIM Surikat Sonya`)
- Region: `us-central1`
- Service: `aim-surikat-sonya`
- Health: `https://aim-surikat-sonya-823425082163.us-central1.run.app/health`
- Telegram webhook: Cloud Run `POST /telegram`
- State bucket: `gs://project-f40c3e3c-0fca-49de-96d-sonya-media/sonya/state/`
- Review catalog: `gs://project-f40c3e3c-0fca-49de-96d-sonya-media/sonya/review-catalog/`
- Live health currently reports `groupChatEnabled=true`,
  `groupVideoReplyEnabled=true`, `autoReviewEnabled=false`,
  `requireSendApproval=true`, and `sashaProactiveDmEnabled=false`.

The local Mac should not poll Telegram while the webhook is active. The local
catalog publisher can still prepare design review cards and upload the GCS
catalog, but it does not own Telegram updates.

## What Runs Where

Cloud Run:

- Receives Telegram webhooks.
- Sends text, reactions, stickers, screenshots, rating buttons, cached
  Telegram video notes, and temporary generated videos.
- Calls Vertex AI Gemini for semantic routing, design scoring, and incoming
  audio/video/image understanding.
- Uploads incoming media to GCS when configured.
- Mirrors owner memory, dispatch state, logs, persona state, sticker moodboard,
  feedback registry, and handoff JSONL files to GCS.

The Mac:

- Generates/rebuilds local design-lab artifacts.
- Runs the local catalog publisher that can see local files and screenshots.
- Can run manual GenMedia tests with Gemini CLI/MCP tools.
- Can post-process Veo output with `ffmpeg` into square Telegram `video_note`
  assets and register reusable Telegram `file_id`s.

## Temporary Cloud Video Generation

For the 2026-05-28 two-day trial, Sonya could generate fresh short videos in
Cloud Run through Vertex AI Veo, without using the Mac. The trial is now
expired and disabled in live health; reopen it only with explicit owner
approval because it is paid media generation.

Runtime flags:

- `SONYA_VIDEO_REPLY_ENABLED=true`
- `SONYA_VIDEO_REPLY_PROVIDER=generator`
- `SONYA_RUNTIME_VEO_ENABLED=true`
- `SONYA_RUNTIME_VEO_OWNER_ONLY=true`
- `SONYA_RUNTIME_VEO_EXPIRES_AT=<two-day cutoff>`
- `SONYA_RUNTIME_VEO_MODEL=veo-3.1-lite-generate-001`
- `SONYA_RUNTIME_VEO_REFERENCE_GCS_URI=gs://project-f40c3e3c-0fca-49de-96d-sonya-media/genmedia/references/sonya-primary-selfie-20260528-140751.jpeg`
- `SONYA_RUNTIME_VEO_MAX_PER_DAY=3`
- `SONYA_RUNTIME_VEO_MAX_PER_CHAT_PER_DAY=2`
- `SONYA_RUNTIME_VEO_COOLDOWN_MINUTES=20`

Cost guardrails:

- Cloud Billing budgets are alerts, not hard caps.
- The runtime records attempts in
  `sonya/state/video-generation-ledger.local.jsonl`.
- Duplicate Telegram updates are suppressed by source message key.
- Daily and per-chat caps count unique generation requests, not every lifecycle
  ledger line.
- `SONYA_RUNTIME_VEO_EXPIRES_AT` is a hard runtime stop even if no human turns
  the feature off.

Current runtime status:

- The current repo `Dockerfile` runtime includes `ffmpeg`, and live health
  reports `runtimeVeo.ffmpegAvailable=true`. If runtime Veo is explicitly
  re-enabled with `SONYA_RUNTIME_VEO_SEND_AS_VIDEO_NOTE=true`, fresh output can
  be square-cropped/scaled and sent as Telegram `sendVideoNote`.
- A buildpack/source deploy without `ffmpeg` must not enable
  `SONYA_RUNTIME_VEO_SEND_AS_VIDEO_NOTE=true`; it can only send normal video.
- Cached greeting/start assets remain real Telegram `video_note` messages
  because they already have Telegram `file_id`s.

## Durable Rule

Do not put media generation inside Semantic Road. Semantic Road decides meaning
and reply intent. The video provider decides whether to render a face/video
reply. This keeps Veo/Krea/other providers swappable and keeps Telegram routing
deterministic.
