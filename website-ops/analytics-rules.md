# Правила аналитики AIM Website

Updated: 2026-06-30

Это правила чтения отчетов по AI Native, payment flow и staging-зеркалу. Не использовать их как карту всей production-аналитики AIM, пока такой workstream явно не открыт.

## Главное правило отчета

Не показывать сырой `Direct` как главный ответ.

Перед интерпретацией direct traffic сначала переклассифицировать визиты через:

1. `traffic_type` (`internal` исключаем для продуктовых выводов);
2. UTM params;
3. referrer host;
4. Metrika messenger/social/search dimensions;
5. AIM-specific mappings below.

Только остаток без usable signal можно называть `Unknown direct`.

## AIM-классификация каналов

| AIM-канал | Что включать |
| --- | --- |
| Telegram | `utm_source=telegram`, historical `tg`/`Tg`, or Metrika messenger Telegram |
| Instagram bio | `bio.aimindset.org`, `utm_source=bio`, or `utm_source=instagram&utm_medium=bio` |
| Instagram organic | `utm_source=instagram`, historical `ig`/`inst`, organic story/post links |
| Email / Substack | `utm_source=email`, `e-mail`, `substack`, or raw Mailing traffic |
| YouTube organic | `utm_source=youtube` unless paid medium is explicit |
| AIM staff/internal | `traffic_type=internal`, referrer under `*.aimindset.org`, or raw Internal traffic |
| Partner/referral link | other referrers and raw Link traffic |
| Search | raw Search engine traffic |
| Paid | `utm_medium=cpc`, `ppc`, `paid`, `paid_social`, `cpm`, `cpv` |
| Unknown direct | direct traffic with no usable UTM/referrer/social/messenger signal |

Historical `tg/ads` and `ig/stories` считаем organic для AIM, если явно не используется настоящий paid medium.

## Staff-mode

Командные проверки помечаем cookie-маркером:

```text
https://ai-native.aimindset.org/?aim_staff=on
https://staging.aimindset.org/pay/?product=ain3_mainearly&aim_staff=on
```

Выключение:

```text
?aim_staff=off
```

Cookie живет 180 дней на браузер/профиль/устройство. После очистки cookies,
нового браузера, нового профиля или инкогнито сотрудник должен открыть служебную
ссылку снова. IP-фильтр можно использовать только как запасной слой: домашние IP
часто меняются и не должны быть главным способом исключения команды.

Если все же собираем домашний IP для дополнительного фильтра, инструкция
сотруднику:

1. Открыть `https://ipinfo.io/ip` из обычного домашнего Wi-Fi.
2. Скопировать внешний IPv4/IPv6. Не присылать локальный адрес вида
   `192.168.x.x`, `10.x.x.x` или `172.16-31.x.x`.
3. Прислать: имя, город, тип сети (дом/офис/коворкинг/мобильная/VPN), IP,
   дату и время проверки.
4. Повторить отдельно для каждого регулярного места работы. Мобильный/VPN IP
   включать только если человек реально всегда работает через него.

## UTM-схема

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

## UTM-таблица

Рабочий реестр: `website-ops/utm-link-table.md`.

Поддерживаем таблицу опубликованных ссылок руками. Минимальные колонки:

- `date`
- `platform`
- `placement`
- `campaign`
- `content_id`
- `final_url`
- `utm_url`
- `ответственный`
- `заметки`

`utm_content` должен указывать на конкретный пост, сторис, bio link, bot flow, partner placement или mailing.

Нет строки — не публикуем внешнюю ссылку. Строка должна появиться до публикации Telegram, Instagram, email, partner, YouTube, bio, bot или direct payment ссылки.

## Как интерпретировать

- Если `pricing viewed` высокий, а `payment clicked` низкий, сначала сравнить по traffic source, а не сразу менять pricing copy.
- Если `Unknown direct` высокий, сначала чинить publishing discipline: UTM links в Telegram, Instagram, email, partner posts и bio routers.
- Если отчет про реальных пользователей, сначала убрать `traffic_type=internal`.
- Если Webvisor показывает blank screens, проверить assets, fonts, CDN availability и regional/network constraints до изменения page copy.
- Если Surikat catches payment contact, но Metrika does not, debug Metrika/browser blocking separately. Surikat is a contact fallback, not analytics truth.
- Если Metrika catches behavior, но Surikat does not send DM, debug relay delivery/allowlist separately.
