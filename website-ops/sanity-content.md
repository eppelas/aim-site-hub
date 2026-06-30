# Наполнение Sanity контентом

Используй этот скилл, когда человек просит наполнить Sanity контентом: добавить/обновить кейсы, отзывы, спикеров, FAQ, цитаты, философию, продукты; собрать блок лабы из этих сущностей; импортировать целую лабу.

Запись идёт по HTTP через `@sanity/client` — Studio запускать НЕ нужно. Токен с правами Editor лежит в `.env` (`SANITY_API_TOKEN`). Скилл запускается в этом репо (нужны схемы `studio/schemaTypes/` и `.env`).

**Центральный принцип: когда данные, источник или намерение неоднозначны — спрашивай человека, не угадывай. Никогда молча не перезаписывай существующее.**

## Границы: данные — да, схему — нет

Скилл меняет ТОЛЬКО данные (документы и их значения). Структуру — схемы в `studio/schemaTypes/` — НЕ трогает: не добавляет/не переименовывает/не удаляет поля, не заводит новые типы документов или блоков, не меняет валидацию. Это область скилла `/sanity-schema` (там правка синхронизируется с парсером, сериализатором, GROQ и документацией).

Если данные человека не влезают в текущую схему (нет подходящего поля, значение вне списка) — НЕ подгонять схему под данные. Остановиться и предложить: (а) положить в существующее поле, (б) пропустить лишнее, (в) если поле действительно нужно — это отдельная задача через `/sanity-schema`. Молчаливое расширение схемы ломает MD-пайплайн и рендер.

Что НЕ является изменением структуры (нормальная работа скилла): писать валидные документы, привязывать references в существующие блоки, грузить фото. А вот состав и порядок блоков лабы (`blocks[]`) — это структура страницы: наполнять существующие блоки можно, добавлять/удалять/переставлять типы блоков без явной просьбы — нет.

## Три уровня работы

1. **Сущность** — создать/обновить standalone-документы (caseStudy, review, speaker, faqItem, quote, philosophyPillar, closingPhrase, product) по справочнику ниже.
2. **Блок** — наполнить блок внутри существующей лабы/главной: создать нужные сущности (если их нет) и связать их в блок через references с `_key`.
3. **Целая лаба** — НЕ реализовывать заново. Направить на MD-формат и `npm run import-lab` (см. раздел «Уровень: целая лаба»).

## Шаг 1. Разобрать намерение

Из свободной формулировки человека («наполни кейсы, данные вот тут», «добавь спикера Ивана, фото в этой папке», «обнови отзывы») определи:

1. **Уровень:** сущность / блок / целая лаба.
2. **Тип сущности:** caseStudy / review / speaker / faqItem / quote / philosophyPillar / closingPhrase / product.
3. **Источник данных:** MD-файл, папка, вставленный в чат текст, таблица.
4. **Фото/ассеты:** есть ли картинки и где они (путь к файлу/папке).
5. **Намерение по дублям:** обычное наполнение или явная команда «обнови/перезапиши».

Если хоть что-то из этого неоднозначно — **остановись и спроси**. Не начинай писать, пока не ясны тип, источник и где брать фото.

## Справочник сущностей

Сверяй по реальным схемам в `studio/schemaTypes/` — это краткая выжимка на момент написания.

| `_type` | id-поле (поиск дублей) | обязательные поля | спецформат | фото | orderable |
|---|---|---|---|---|---|
| `caseStudy` | `title` | `title` | `filters[]` ⊆ `{manager, creative, developer, educator}`; `videoUrl` — только YouTube | `image`, `productImage` (опц.) | да (`orderRank`) |
| `review` | `name` | `name`, `quote` | `telegram` — хэндл без `@` | `photo` (опц.) | да (`orderRank`) |
| `speaker` | `name` | `name` | — | `photo` (опц.) | да (`orderRank`) |
| `faqItem` | `title` (тех. id) | `title`, `question`, `answer` | `title` ~ `^[a-z0-9_]+$`; `category` ∈ `{organization, expectations, payment}` | нет | да (`orderRank`) |
| `quote` | `title` | `title`, `text` | — | нет | да (`orderRank`) |
| `philosophyPillar` | `title` | `title`, `description`, **`image`** | `image` ОБЯЗАТЕЛЬНА | да, обязательно | да (`orderRank`) |
| `closingPhrase` | `title` | `text` (только!) | `title` опционален | нет | нет |
| `product` | `title` | `title`, `badge`, `description`, `linkType`, `order` | `linkType` ∈ `{internal, external}`; `order` — int > 0; `slug` при internal / `externalUrl` при external | `icon` (опц.) | нет (сортировка числовым `order`) |

Доп. опциональные поля (не обязательные, но часто нужны): `caseStudy` — `author, role, summary, details, tools, metric, productImageAlt`; `review` — `role`; `speaker` — `role, bio`; `quote` — `author, role`.

## Шаг 2. Подготовить и провалидировать данные

До любой записи проверь по справочнику:

1. **Обязательные поля** присутствуют и непустые.
2. **Форматы:** `faqItem.title` матчит regex; `caseStudy.filters` только из разрешённого списка; `product.linkType`/`order` корректны; `videoUrl` — YouTube.
3. **References** (для блока) указывают на реально существующие документы.
4. Не хватает данных или формат неверный → **спроси/сообщи, не пиши битый документ.**

## Шаг 3. Проверить дубликаты (ключевое)

Перед записью каждой сущности запроси существующие по id-полю (`title`/`name`):

```js
const found = await client.fetch(
  `*[_type == $type && title == $id]{ _id, title }`, // для review/speaker: name вместо title
  { type: 'caseStudy', id: 'AI VISION' }
)
```

Реакция:

1. **0 совпадений** → создавать.
2. **1 совпадение, нет команды обновлять** → **СТОП, спросить**: обновить / пропустить / создать под другим id. По возможности показать, чем новые данные отличаются от существующих.
3. **2+ совпадения** (неоднозначность) → спросить, какой именно документ имеется в виду.
4. **Явная команда** («обнови дубли», «перезапиши») → обновлять без вопросов.

**Бери `_id` найденного документа и обновляй именно его (`patch`).** Если документ создан вручную в Studio, у него случайный `_id`; слепой `createOrReplace` со своим детерминированным `_id` создаст ВТОРОЙ документ-дубль. Поиск всегда по id-полю, апдейт — по реальному `_id`.

## Шаг 4. План перед записью (dry-run)

Перед фактической записью (особенно для пачки) покажи сводку: **что будет создано / обновлено / пропущено**, с id-полями. Получи подтверждение — затем пиши.

## Шаг 5. Запись — паттерн скрипта

Способ записи — одноразовый `.mjs`-скрипт по образцу `scripts/seed-cases.mjs`. Клади его в `scripts/` (тогда путь к `.env` ниже верный); можно удалить после прогона. Запуск: `node scripts/<имя>.mjs`.

```js
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Парсинг .env без dotenv (образец seed-cases.mjs)
const envPath = resolve(import.meta.dirname, '..', '.env')
for (const line of readFileSync(envPath, 'utf-8').split('\n')) {
  const t = line.trim()
  if (!t || t.startsWith('#')) continue
  const i = t.indexOf('=')
  if (i === -1) continue
  if (!process.env[t.slice(0, i).trim()]) process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim()
}

const client = createClient({
  projectId: 'ms4mgrt9',
  dataset: 'production',
  apiVersion: '2026-03-29',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
```

Выбор операции записи:

1. `client.create(doc)` — создать; падает, если `_id` занят.
2. `client.createIfNotExists(doc)` — создать только если документа нет.
3. `client.createOrReplace(doc)` — создать ИЛИ заменить **целиком**.
4. `client.patch(_id).set({ field: value }).commit()` — частичное обновление существующего.

**Создание новой сущности:** детерминированный `_id` вида `<тип>-<slug-id>` (`review-olya-eremina`, `case-team-os-darya`, `faq-payment-1`) + `createOrReplace` (идемпотентно — повторный прогон не задвоит). Обязательно укажи `_type`.

**Обновление существующей:** `patch(_id).set({ ...только меняемые поля })`. НЕ используй `createOrReplace` для частичного апдейта — он сотрёт незаданные поля (фото, orderRank).

**orderRank** (для orderable-типов) — строковый, образец `makeOrderRank` из `seed-cases.mjs`:

```js
function makeOrderRank(index) {
  const chars = 'abcdefghijklmnopqrstuvwxyz'
  return `${chars[Math.floor(index / 10)]}${index % 10}|`
}
```

При **добавлении к существующим** не начинай с `index = 0` (`a0|` перекроет порядок). Запроси текущее число документов типа и стартуй с него, либо возьми `max(orderRank)` и продолжи после. `product` и `closingPhrase` — без `orderRank` (`product` сортируется числовым `order`).

## Фото и ассеты

Двухшаговая загрузка (образец `studio/scripts/seedCommunityNightCases.mjs`):

```js
import { createReadStream } from 'fs'

const asset = await client.assets.upload('image', createReadStream(filepath), { filename })
// SVG: добавь { filename, contentType: 'image/svg+xml' }

const imageField = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
// дальше: doc.photo = imageField / doc.image = imageField / doc.productImage = imageField
```

1. Путь к фото указан, но файла нет → спроси или пропусти с явным предупреждением, не падай.
2. `philosophyPillar` без `image` создать нельзя — документ невалиден; нет картинки → запроси.
3. MD-пайплайн (`import-lab`) фото НЕ переносит. После импорта лабы фото сущностей грузятся ТОЛЬКО здесь (`assets.upload` + `patch().set({ photo: imageField })`).

## Уровень «Блок»: привязка сущностей

Блоки живут в массиве `blocks[]` родительского документа (лаба — `*[_type=="lab" && slug.current==$slug]`; либо документ главной). Алгоритм (образец `attachToLab` в `seedCommunityNightCases.mjs`):

1. Создай/найди нужные сущности (шаги 2-5), собери их `_id`.
2. Найди родительский документ и индекс нужного блока в `blocks[]` (`b._type === 'casesBlock'`).
3. Собери массив references — **каждому элементу свой `_key`** (любая уникальная строка):

```js
const refs = ids.map((id) => ({ _key: `ref-${id}`, _type: 'reference', _ref: id }))
await client.patch(labId).set({ [`blocks[${idx}].cases`]: refs }).commit()
// адресация по ключу блока тоже ок: blocks[_key=="<key>"].cases
```

Поле-список в каждом блоке:

| блок | поле | тип |
|---|---|---|
| `casesBlock` | `cases` | массив reference → `caseStudy` |
| `speakersBlock` | `speakers` | массив reference → `speaker` |
| `reviewsBlock` | `reviews` | массив reference → `review` |
| `faqBlock` | `faqItems` | массив reference → `faqItem` |
| `quotesBlock` | `quotes` | массив reference → `quote` |
| `philosophyBlock` | `pillars` | массив reference → `philosophyPillar` |
| `closingBlock` | `closingPhrase` | **одиночный** reference → `closingPhrase` |

Нюансы:

1. `closingBlock.closingPhrase` — одиночный reference, БЕЗ `_key`: `set({ 'blocks[N].closingPhrase': { _type: 'reference', _ref: id } })`.
2. Пустой массив в блоке = «показать все» документы этого типа (fallback на сайте). Привязывай явный список, только если человек хочет конкретную подборку.
3. `productsBlock.products[]` — это инлайн-объекты `productItem` (`title/badge/description/url`), а НЕ references на документ `product`. Standalone `product` — отдельный глобальный список (`PRODUCTS_QUERY`, сортировка по `order`), он не привязывается через блок. Уточни у человека, что именно ему нужно.

## Уровень «Целая лаба»

НЕ собирать лабу из блоков вручную — для этого есть готовый пайплайн:

1. Импорт из MD: `npm run import-lab content/labs/<file>.md`. Формат — `docs/architecture/md-format.md`, парсер — `scripts/lab-md-parser.mjs`.
2. Текущее состояние лабы в MD: `npm run export-lab <slug>` — удобно как стартовая точка для правок.
3. Роль скилла здесь — помочь собрать корректный MD и запустить импорт, а не дублировать логику парсера.
4. Фото сущностей `import-lab` не тянет — добавляй их отдельно (см. «Фото и ассеты»).

## Грабли / Не сломать

| Грабля | Почему ломается | Как избежать |
|---|---|---|
| Задвоение документа | `createOrReplace` со своим `_id`, когда существующий имеет другой (случайный) `_id` | Искать по id-полю (`title`/`name`), брать `_id` найденного, `patch` его |
| Стёрлись фото/orderRank | `createOrReplace` заменяет документ ЦЕЛИКОМ | Для частичного апдейта — `patch().set({ ...только нужные })` |
| Блок/рендер падает | У элемента массива нет `_key` | Каждому элементу массива references — уникальный `_key` |
| reference не сработал | Записана строка id вместо объекта | reference = `{ _type:'reference', _ref:'<id>' }`, в массиве ещё `_key` |
| `closingPhrase` не привязалась | Обернули в массив / добавили `_key` | Это одиночный reference, без `_key`, не массив |
| Перепутаны продукты | `productsBlock.products` ≠ документ `product` | Инлайн `productItem` в блоке vs глобальный standalone `product` — разные сущности |
| `faqItem` невалиден | В `title` записан текст вопроса | `title` — тех. id (`^[a-z0-9_]+$`), вопрос идёт в `question` |
| `philosophyPillar` не сохранился | Нет `image` (обязательна) | Загрузить картинку до записи или запросить у человека |
| Порядок сломался | `orderRank` начат с `a0|` поверх существующих | Стартовать с числа существующих или продолжить от `max` |
| Документ без `_type` | Забыт `_type` в объекте | Указывать `_type` в каждом документе |
| Молчаливая перезапись | Записали поверх без подтверждения | Дубль без явной команды → спросить (шаг 3) |

## Безопасность

1. Не печатать `SANITY_API_TOKEN` в логи/ответы.
2. Не удалять документы (`client.delete`) без явной команды человека.
3. Sanity — источник истины для контента; схему не менять — см. «Границы: данные — да, схему — нет».
4. Не добавлять npm-зависимости.

## Контекст

1. Схемы сущностей: `studio/schemaTypes/{caseStudy,review,speaker,faqItem,quote,philosophyPillar,closingPhrase,product}.ts`.
2. Схемы блоков: `studio/schemaTypes/blocks/{cases,speakers,reviews,faq,quotes,philosophy,closing,products}Block.ts`.
3. Образцы записи (env-парсинг, `createOrReplace`, `makeOrderRank`): `scripts/seed-cases.mjs`, `scripts/seed-reviews.mjs`, `scripts/seed-faq.mjs`.
4. Образец загрузки фото + привязки к блоку: `studio/scripts/seedCommunityNightCases.mjs`.
5. GROQ-запросы сайта (как контент реально читается): `src/lib/queries.ts`.
6. Целая лаба из MD: `docs/architecture/md-format.md`, `scripts/lab-md-parser.mjs`, `npm run import-lab` / `npm run export-lab`.
