# UTM-таблица AI Native / Payment

Updated: 2026-06-30

Scope: AI Native landing, payment и staging attribution links. Не использовать эту таблицу для unrelated production analytics surfaces, пока владелец явно не откроет этот workstream.

Rule: no row, no published external link. Перед публикацией Telegram, Instagram, email, partner, YouTube, bio, bot или direct payment ссылки должна появиться строка в таблице.

## Колонки

| Колонка | Что значит |
| --- | --- |
| `date` | Дата публикации или планируемого выхода. |
| `platform` | `telegram`, `instagram`, `email`, `substack`, `partner`, `youtube` и т.п. |
| `placement` | `post`, `story`, `bio`, `bot`, `mailing`, `referral`, `video` и т.п. |
| `campaign` | Текущая AI Native campaign: `ain3`. |
| `content_id` | Человеко-понятный id конкретного поста, сторис, bio-ссылки, bot flow, письма или партнерского слота. |
| `final_url` | Куда ведет ссылка без UTM-параметров. |
| `utm_url` | Ссылка с `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`. |
| `ответственный` | Человек или команда, которые публикуют ссылку и смогут потом объяснить контекст. |
| `заметки` | Контекст, название поста, канал или заметки для чистки отчетов. |

## Рабочая таблица

| date | platform | placement | campaign | content_id | final_url | utm_url | ответственный | заметки |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| template | telegram | post | `ain3` | `<post_id>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=telegram&utm_medium=post&utm_campaign=ain3&utm_content=<post_id>` | Анка | Пост или публикация в Telegram. |
| template | telegram | bot | `ain3` | `<flow_id>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=telegram&utm_medium=bot&utm_campaign=ain3&utm_content=<flow_id>` | Анка | Ссылка из бота, меню или deeplink-сценария. |
| template | instagram | bio | `ain3` | `bio_link` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=instagram&utm_medium=bio&utm_campaign=ain3&utm_content=bio_link` | Анка | `bio.aimindset.org` в отчетах считаем Instagram bio. |
| template | instagram | story | `ain3` | `<story_id>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=instagram&utm_medium=story&utm_campaign=ain3&utm_content=<story_id>` | Анка | Личная/органическая сторис, не реклама. |
| template | instagram | post | `ain3` | `<post_id>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=instagram&utm_medium=post&utm_campaign=ain3&utm_content=<post_id>` | Анка | Пост или ссылка из описания reels. |
| template | email | mailing | `ain3` | `<mailing_id>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=email&utm_medium=email&utm_campaign=ain3&utm_content=<mailing_id>` | AIM | Email-рассылка. |
| template | substack | mailing | `ain3` | `<post_id>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=substack&utm_medium=email&utm_campaign=ain3&utm_content=<post_id>` | AIM | Пост в рассылке/newsletter. |
| template | partner | referral | `ain3` | `<partner_or_slot>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=<partner>&utm_medium=referral&utm_campaign=ain3&utm_content=<partner_or_slot>` | AIM | Партнерская публикация, ссылка от спикера или внешний слот. |
| template | youtube | video | `ain3` | `<video_id_or_description>` | `https://ai-native.aimindset.org/` | `https://ai-native.aimindset.org/?utm_source=youtube&utm_medium=video&utm_campaign=ain3&utm_content=<video_id_or_description>` | AIM | Органическая ссылка из описания видео или закрепленного комментария. |

## Правила названий

- Use lowercase values.
- Current campaign: `utm_campaign=ain3`.
- Telegram: `utm_source=telegram`, `utm_medium=post|bot|story`.
- Instagram: `utm_source=instagram`, `utm_medium=bio|story|post`.
- Email/Substack: `utm_medium=email`.
- Личные сторис/посты считаем organic, не ads.
- `utm_content` должен указывать на конкретную публикацию, а не на общий канал.
- Если ссылка ведет сразу на оплату, сохраняем те же UTM-поля и ставим payment URL в `final_url`.

## Как использовать в отчетах

Когда читаем отчеты, используем эту таблицу до того, как принять raw `Direct`:

1. Сначала матчим прямые UTM-строки.
2. `bio.aimindset.org` считаем Instagram bio.
3. Старые алиасы переклассифицируем по `website-ops/analytics-rules.md`.
4. Только direct-визиты без UTM/referrer/social/messenger signal остаются `Unknown direct`.
