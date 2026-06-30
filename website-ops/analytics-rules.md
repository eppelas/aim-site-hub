# AI Native / Payment Analytics Rules

Updated: 2026-06-30

These are the reporting rules for AI Native, payment, and staging analytics.

## Reporting Rule

Do not report raw `Direct` as the primary answer.

Before interpreting direct traffic, reclassify visits using:

1. UTM params;
2. referrer host;
3. Metrika messenger/social/search dimensions;
4. AIM-specific mappings below.

Only the remainder should be called `Unknown direct`.

## AIM Channel Mapping

| AIM channel | Include |
| --- | --- |
| Telegram | `utm_source=telegram`, historical `tg`/`Tg`, or Metrika messenger Telegram |
| Instagram bio | `bio.aimindset.org`, `utm_source=bio`, or `utm_source=instagram&utm_medium=bio` |
| Instagram organic | `utm_source=instagram`, historical `ig`/`inst`, organic story/post links |
| Email / Substack | `utm_source=email`, `e-mail`, `substack`, or raw Mailing traffic |
| YouTube organic | `utm_source=youtube` unless paid medium is explicit |
| AIM internal | referrer under `*.aimindset.org` or raw Internal traffic |
| Partner/referral link | other referrers and raw Link traffic |
| Search | raw Search engine traffic |
| Paid | `utm_medium=cpc`, `ppc`, `paid`, `paid_social`, `cpm`, `cpv` |
| Unknown direct | direct traffic with no usable UTM/referrer/social/messenger signal |

Historical `tg/ads` and `ig/stories` are organic for AIM unless a real paid medium is used.

## UTM Scheme

Use lowercase values.

Telegram post:

```text
utm_source=telegram
utm_medium=post
utm_campaign=ain3
utm_content=<post_id>
```

Telegram bot:

```text
utm_source=telegram
utm_medium=bot
utm_campaign=ain3
utm_content=<bot_or_flow_id>
```

Instagram bio:

```text
utm_source=instagram
utm_medium=bio
utm_campaign=ain3
utm_content=bio_link
```

Instagram story:

```text
utm_source=instagram
utm_medium=story
utm_campaign=ain3
utm_content=<story_id>
```

Email/Substack:

```text
utm_source=email | substack
utm_medium=email
utm_campaign=ain3
utm_content=<mailing_id>
```

## UTM Table

Keep a human-maintained table for published links. Minimum columns:

- `date`
- `platform`
- `placement`
- `campaign`
- `content_id`
- `final_url`
- `utm_url`
- `owner`
- `notes`

`utm_content` should identify the exact post, story, bio link, bot flow, partner placement, or mailing.

## Interpretation Notes

- If `pricing viewed` is high but `payment clicked` is low, compare by traffic source before changing pricing copy.
- If `Unknown direct` is high, fix publishing discipline first: UTM links in Telegram, Instagram, email, partner posts, and bio routers.
- If Webvisor shows blank screens, inspect assets, fonts, CDN availability, and regional/network constraints before changing page copy.
- If Surikat catches a payment contact but Metrika does not, debug Metrika/browser blocking separately. Surikat is a contact fallback, not analytics truth.
- If Metrika catches behavior but Surikat does not send a DM, debug relay delivery/allowlist separately.
