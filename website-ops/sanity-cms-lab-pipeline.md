# Sanity CMS и импорт лабораторий из Markdown

> Если вы открыли этот файл напрямую: основная читаемая страница с кнопками
> скачивания и копирования находится здесь:
> [Sanity CMS для лабораторий](../sanity-cms.html).

## Быстрые действия

- ⬇ [Скачать полный пакет скилла `.zip`](create-aim-lab-md-skill-pack.zip) —
  `SKILL.md`, настройка агента и reference-документы вместе.
- ⬇ [Скачать только `SKILL.md`](create-aim-lab-md-skill.md) — удобно для
  просмотра, но для установки скилла лучше брать полный пакет.
- ⬇ [Скачать промпт `.md`](create-aim-lab-md-prompt.md) — разовый промпт для
  агента, если скилл не установлен.
- ↗ [Открыть страницу Sanity CMS](../sanity-cms.html) — там есть кнопки
  `Копировать текст скилла`, `Копировать промпт` и ссылка для разработчика.

Промпта самого по себе недостаточно. Для создания новой лаборатории к нему
нужно приложить `create-lab-from-md.md`, свежий `common_content.md`, brief или
ссылку на прошлую лабу, а также `product_code` каждого тарифа из каталога
Дана / NocoDB.

Это рабочая карта для контента AIM Website: как связаны Sanity, Astro, импорт
лабораторий из Markdown, платежные коды, staging и QA-передача.

## Что делает Sanity

Sanity CMS — источник контента AIM Website. Редакторы работают в Sanity Studio
и поддерживают лаборатории, общих спикеров, кейсы, отзывы, FAQ, цитаты,
philosophy-блоки, навигацию, футер и юридические страницы.

Текущая конфигурация Studio:

- project: `ms4mgrt9`;
- dataset: `production`;
- локальный порт Studio: `3343`;
- источник: `Site Repo - ai-mindset-website/studio/sanity.config.ts`.

## Sanity CLI и чистая Studio

Основной repo уже содержит AIM Studio в
`Site Repo - ai-mindset-website/studio`. Для обычной работы используйте именно
эту Studio:

```bash
cd "Site Repo - ai-mindset-website/studio"
npm install
npm run dev
```

Если существующая Studio недоступна или агенту нужна чистая Sanity-поверхность
для инспекции, создайте отдельную scratch Studio, подключенную к тому же
проекту:

```bash
mkdir -p ~/tmp/aim-sanity-clean
cd ~/tmp/aim-sanity-clean
npm create sanity@latest -- --project ms4mgrt9 --dataset production --template clean
```

Используйте это только в scratch-папке. Команда создает новый scaffold Studio;
это не миграционная команда, и ее нельзя запускать внутри активного AIM Website
repo, если задача явно не состоит в замене или регенерации Studio-файлов.

Общие сущности для reference-блоков лабораторий экспортируются через кнопку
Studio `Экспорт общего контента`. Экспортированный файл называется
`common_content.md`; он создается только из опубликованных Sanity-сущностей и
является единственным допустимым источником reference-ID в lab Markdown.

## Что делает Astro

Astro 5 собирает статический сайт из данных Sanity. Страницы лабораторий
рендерятся по адресу `/labs/[slug]`; главная страница — по `/`.

Sanity read client в `src/lib/sanity.ts` использует `useCdn: false`. Это
намеренно: Sanity publish может сразу запускать rebuild, а Sanity CDN иногда
отстает на 30-60 секунд. Прямое чтение помогает staging/new rebuild брать
свежий контент.

Отдельный сервис `Astra` в текущем AIM Website repo не задокументирован.
Контентно-сборочный слой в проверенном исходнике — это `Astro`.

## Способы создать лабораторию

Есть три поддерживаемых способа создать или обновить контент лаборатории.

### 1. Ручное редактирование в Studio

Используется для прямой редакторской работы и общих сущностей:

1. Открыть Studio локально или в hosted-варианте.
2. Отредактировать документ `Лаборатория` или shared entities напрямую.
3. Нажать publish.
4. Sanity webhook запустит rebuild для staging и new.

Общие сущности вроде speakers, cases, reviews, FAQ, quotes, philosophy и
closing phrases управляются в Studio. Их нельзя придумывать внутри lab
Markdown.

### 2. Markdown upload в Studio

Используется, когда страницу лаборатории нужно собрать агентом или редактором в
одном переносимом файле.

1. В Studio нажать `Экспорт общего контента` и скачать свежий
   `common_content.md`.
2. Передать агенту:
   - `create-lab-from-md.md`;
   - свежий `common_content.md`;
   - прошлую лабу / source page или сырой brief лабы.
3. Агент заполняет полный lab Markdown.
4. В Studio нажать `Создать лабу из MD` для новой лабы или открыть существующую
   и нажать `Обновить из MD`.
5. Проверить результат в Studio, затем publish.

Правила slug:

- frontmatter `slug` задает идентичность лабы и URL-сегмент;
- имя файла не задает идентичность;
- duplicate slugs блокируются в Studio, включая draft-документы.

Правила reference:

- ID в reference-блоках должны точь-в-точь совпадать с `common_content.md`;
- если сущности нет, ее нужно создать в Studio и заново экспортировать
  `common_content.md`;
- пустой reference-блок означает "все сущности" и используется только когда
  такое поведение действительно нужно.

### 3. Git Markdown import

Используется для repo-based контентных операций.

1. Положить lab-файл в `content/labs/<slug>.md`.
2. Запушить в `main`.
3. `.github/workflows/import-labs.yml` запускает `npm run import-lab` для
   измененных lab-файлов.
4. `scripts/import-lab.mjs` импортирует распарсенную лабу в Sanity.

CLI import требует:

- `SANITY_PROJECT_ID`;
- `SANITY_API_TOKEN`;
- optional `SANITY_DATASET`, default `production`;
- optional `SANITY_API_VERSION`, default `2026-03-29`.

CLI import по умолчанию падает на отсутствующих references. Studio import
разрешает missing references как warnings, потому что редактор может проверить
результат до публикации.

## Связь с оплатой

Sanity хранит product code каждого pricing plan в
`pricingBlock.plans[].productCode`. Sanity не является source of truth для цен.

`product_code` должен приходить из каталога Дана / NocoDB. Slug страницы лабы
не является основанием для платежного кода, и агент не должен генерировать
коды.

Runtime flow цены:

1. Astro-страница рендерит pricing block.
2. Клиентская pricing card дедуплицирует product codes.
3. Card вызывает `/api/payment/site-discount-check`.
4. Если код резолвится, card показывает runtime EUR price.
5. Если кода нет, он неизвестен или payment runtime недоступен, card
   откатывается к `цена уточняется`; payment popup делает собственную runtime
   проверку.

Для рабочей продажи у каждого видимого тарифа должен быть подтвержденный
product code в NocoDB и успешная runtime-проверка оплаты.

## Staging и deployment

Sanity publish запускает один webhook:

`Sanity publish -> repository_dispatch: sanity-content-update -> deploy-staging + deploy-new`

Deploy workflows собирают Astro-сайт и делают rsync `dist/` на VPS:

- staging: `https://staging.aimindset.org/`;
- new: `https://new.aimindset.org/`.

Git pushes тоже могут запускать deploy, но content-only изменения
`content/labs/**/*.md` сначала проходят import workflow, чтобы Sanity оставался
source of truth.

## Vibe-coding страницы и агенты

Когда создаются vibe-coded лендинги или standalone visual pages на основе AIM
контента:

- брать актуальный lab/shared content из Sanity exports, Studio или repo scripts,
  которые знают про Sanity;
- не использовать старые скриншоты, старый `common_content.md` или память чата
  как финальный source of truth;
- использовать `common_content.md` для identifiers и экспортированный lab
  Markdown для структуры lab page;
- сохранять product codes точь-в-точь при подключении payment buttons или
  embeds;
- проверять staging/local preview после изменений контента или payment surfaces.

## Vasily / QA handoff

Surikat Vasily задокументирован как AIM/NIMS website QA intake и Telegram
dispatcher. Он может маршрутизировать website bugs, QA questions,
staging/production issues, CTA/form/payment reports и owner-gated site audit
requests.

Источник правил поведения Vasily — `website-ops/bot-operating-rules.md`.
Telegram-пересказ из памяти не считается durable content truth, пока конкретное
правило или source не экспортированы в tracked docs или не подтверждены owner.

## Канонические source-файлы

- `Site Repo - ai-mindset-website/docs/architecture/README.md`
- `Site Repo - ai-mindset-website/docs/architecture/md-format.md`
- `Site Repo - ai-mindset-website/docs/guides/create-lab-from-md.md`
- `Site Repo - ai-mindset-website/docs/architecture/payment-price-flow.md`
- `Site Repo - ai-mindset-website/docs/payment-integration.md`
- `Site Repo - ai-mindset-website/docs/operations/lab-payment-setup.md`
- `Site Repo - ai-mindset-website/docs/guides/sanity-rebuild-webhook-setup.md`
- `Site Repo - ai-mindset-website/studio/lib/commonContentMd.mjs`
- `Site Repo - ai-mindset-website/studio/components/CreateLabFromMdButton.tsx`
- `Site Repo - ai-mindset-website/studio/components/ExportCommonContentButton.tsx`
- `Site Repo - ai-mindset-website/scripts/import-lab.mjs`
- `Site Repo - ai-mindset-website/scripts/export-lab.mjs`
- `website-ops/bot-operating-rules.md`
