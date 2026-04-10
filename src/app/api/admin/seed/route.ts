import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/seed - Clear and re-seed database with comprehensive mock data
export async function POST() {
  try {
    // Clear existing data in reverse dependency order
    await db.activityLog.deleteMany()
    await db.newsTag.deleteMany()
    await db.comment.deleteMany()
    await db.menuItem.deleteMany()
    await db.setting.deleteMany()
    await db.media.deleteMany()
    await db.page.deleteMany()
    await db.news.deleteMany()
    await db.tag.deleteMany()
    await db.category.deleteMany()
    await db.user.deleteMany()

    // ===== USERS (3) =====
    const admin = await db.user.create({
      data: {
        email: 'admin@sportshub.com',
        name: 'Администратор',
        role: 'admin',
        bio: 'Главный администратор портала',
      },
    })

    const editor = await db.user.create({
      data: {
        email: 'editor@sportshub.com',
        name: 'Главный редактор',
        role: 'editor',
        bio: 'Руководитель редакции US Sports Hub',
      },
    })

    const author = await db.user.create({
      data: {
        email: 'author@sportshub.com',
        name: 'Спортивный журналист',
        role: 'editor',
        bio: 'Эксперт по американскому спорту',
      },
    })

    // ===== CATEGORIES (8) =====
    const categories = await Promise.all([
      db.category.create({ data: { name: 'NFL', slug: 'nfl', color: '#dc2626', order: 1 } }),
      db.category.create({ data: { name: 'NBA', slug: 'nba', color: '#ea580c', order: 2 } }),
      db.category.create({ data: { name: 'MLB', slug: 'mlb', color: '#2563eb', order: 3 } }),
      db.category.create({ data: { name: 'NHL', slug: 'nhl', color: '#06b6d4', order: 4 } }),
      db.category.create({ data: { name: 'Трансферы', slug: 'transfery', color: '#a855f7', order: 5 } }),
      db.category.create({ data: { name: 'Аналитика', slug: 'analitika', color: '#10b981', order: 6 } }),
      db.category.create({ data: { name: 'Интервью', slug: 'intervyu', color: '#f59e0b', order: 7 } }),
      db.category.create({ data: { name: 'Фэнтези', slug: 'fantasy', color: '#ec4899', order: 8 } }),
    ])

    // ===== TAGS (10) =====
    const tags = await Promise.all([
      db.tag.create({ data: { name: 'NFL Playoffs', slug: 'nfl-playoffs', color: '#dc2626' } }),
      db.tag.create({ data: { name: 'NBA Draft', slug: 'nba-draft', color: '#ea580c' } }),
      db.tag.create({ data: { name: 'Травмы', slug: 'travmy', color: '#ef4444' } }),
      db.tag.create({ data: { name: 'Трансферы', slug: 'transfery-tag', color: '#a855f7' } }),
      db.tag.create({ data: { name: 'MVP', slug: 'mvp', color: '#eab308' } }),
      db.tag.create({ data: { name: 'Супербоул', slug: 'superboul', color: '#dc2626' } }),
      db.tag.create({ data: { name: 'Финал НБА', slug: 'final-nba', color: '#ea580c' } }),
      db.tag.create({ data: { name: 'Мировая серия', slug: 'mirovaya-seriya', color: '#2563eb' } }),
      db.tag.create({ data: { name: 'Стэнли Кубок', slug: 'stanley-kubok', color: '#06b6d4' } }),
      db.tag.create({ data: { name: 'Фэнтези', slug: 'fantasy-tag', color: '#ec4899' } }),
    ])

    // ===== NEWS (15 articles) =====
    const newsData = [
      {
        title: 'Канзас-Сити Чифс победили в Супербоуле LVIII',
        slug: 'kanzas-siti-chifs-pobedili-v-superboul-lviii',
        excerpt: 'Патрик Махомс привёл свою команду к победе в напряжённом матче, установив новый рекорд Супербоула по передачам.',
        content: `# Канзас-Сити Чифс — чемпионы Супербоула LVIII

## Историческая победа

В финальном матче сезона НФЛ **Канзас-Сити Чифс** одержали победу над Сан-Франциско Форти Найнерс со счётом 25:22 в овертайме.

Патрик Махомс продемонстрировал выдающуюся игру, завершив матч с **333 ярдами** на пасах и **2 тачдаунами**. Матч продлился до овертайма, где Чифс сумели забить решающий тачдаун и secured победу.

## Ключевые моменты

- Махомс стал самым молодым квотербеком с двумя победами в Супербоуле
- Трешавон Келси установил рекорд Супербоула по приёмам
- Защита Чифс позволила всего 14 очков в первых трёх четвертях

## Реакция

> «Это невероятное чувство. Мы никогда не сдались», — сказал Патрик Махомс после матча.`,
        image: '/images/hero-NFL.png',
        status: 'published',
        featured: true,
        authorId: admin.id,
        categoryId: categories[0].id,
        publishedAt: new Date('2024-02-11'),
        seoTitle: 'Чифс победили в Супербоуле LVIII — подробный обзор матча',
        seoDesc: 'Канзас-Сити Чифс одержали победу в Супербоуле LVIII над Сан-Франциско. Подробности, статистика и аналитика матча.',
        seoKeywords: 'Супербоул, Чифс, Махомс, НФЛ, NFL',
        tagIndices: [0, 5],
      },
      {
        title: 'Леброн Джеймс побил рекорд по очкам за карьеру в НБА',
        slug: 'lebron-dzheims-pobil-rekord-po-ochkam-za-kareru',
        excerpt: 'Леброн Джеймс превзошёл Карима Абдул-Джаббара, став лучшим бомбардиром в истории НБА.',
        content: `# Леброн Джеймс — новый король НБА по очкам

## Исторический момент

Леброн Джеймс из **Лос-Анджелес Лейкерс** установил новый рекорд НБА по количеству набранных очков за карьеру, превзойдя легендарный показатель Карима Абдул-Джаббара.

Этот исторический момент состоялся в матче против **Оклахома-Сити Тандер** перед домашней публикой в Crypto.com Arena.

## Статистика карьеры

- **38 388 очков** и продолжает набирать
- **20 сезонов** в НБА
- **4 чемпионства** НБА
- **4 награды MVP** регулярного сезона`,
        image: '/images/hero-NBA.png',
        status: 'published',
        featured: true,
        authorId: editor.id,
        categoryId: categories[1].id,
        publishedAt: new Date('2024-03-01'),
        seoTitle: 'Леброн Джеймс — лучший бомбардир в истории НБА',
        seoDesc: 'Леброн Джеймс превзошёл рекорд Карима Абдул-Джаббара по количеству очков за карьеру в НБА.',
        seoKeywords: 'Леброн, НБА, рекорд, очки, Lakers',
        tagIndices: [4],
      },
      {
        title: 'Анализ: Лучшие новички драфта НФЛ 2024',
        slug: 'analiz-luchshie-novichki-drafta-nfl-2024',
        excerpt: 'Разбор выступлений самых ярких дебютантов сезона, включая Кейла Уильямса и Кейдена Бойса.',
        content: `# Анализ новичков драфта НФЛ 2024

## Топ-новички сезона

Сезон 2024 подарил фанатам НФЛ целый ряд выдающихся новичков. **Кейл Уильямс** показал впечатляющие результаты на позиции квотербека, а **Кейден Бойс** стал одним из самых продуктивных ресиверов лиги.

### Оценки по позициям

| Позиция | Игрок | Команда | Оценка |
|---------|-------|---------|--------|
| QB | Кейл Уильямс | Чикаго Бэрс | A- |
| WR | Кейден Бойс | Аризона Кардиналс | B+ |
| OT | Джо Альт | Нью-Йорк Джетс | A |

## Прогноз на второй год

Ожидается, что большинство новичков значительно улучшат свои показатели во втором сезоне.`,
        image: null,
        status: 'published',
        featured: false,
        authorId: admin.id,
        categoryId: categories[5].id,
        publishedAt: new Date('2024-04-15'),
        seoTitle: 'Лучшие новички драфта НФЛ 2024 — полный анализ',
        seoDesc: 'Детальный разбор выступлений rookies НФЛ сезона 2024 с оценками и прогнозами.',
        seoKeywords: 'НФЛ, драфт, новички, rookies, аналитика',
        tagIndices: [0],
      },
      {
        title: 'НХЛ: прогнозы на плей-офф и претенденты на Кубок Стэнли',
        slug: 'nhl-prognozy-na-plej-off-i-kubok-stenli',
        excerpt: 'Эксперты предсказывают один из самых захватывающих плей-офф за последние годы.',
        content: `# НХЛ: Плей-офф 2024 — прогнозы экспертов

По мере приближения плей-офф НХЛ, эксперты сходятся во мнении, что этот сезон может подарить один из самых захватывающих финалов Кубка Стэнли.

## Главные претенденты

- **Нью-Йорк Рейнджерс** — лучший результат в Восточной конференции
- **Колорадо Эвеланш** — фаворит Запада
- **Торонто Мейпл Лифс** — стремятся прервать серию поражений`,
        image: '/images/hero-NHL.png',
        status: 'draft',
        featured: false,
        authorId: editor.id,
        categoryId: categories[3].id,
        publishedAt: null,
        seoTitle: 'Прогнозы на плей-офф НХЛ 2024',
        seoDesc: 'Аналитика и прогнозы экспертов на плей-офф НХЛ и Кубок Стэнли.',
        seoKeywords: 'НХЛ, плей-офф, Кубок Стэнли, прогнозы',
        tagIndices: [8],
      },
      {
        title: 'Шоэй Отани — первый двусторонний MVP в истории МЛБ',
        slug: 'shoehi-otani-pervyj-dvustoronnij-mvp-v-istorii-mlb',
        excerpt: 'Уникальное достижение японской звезды бейсбола покорило всю спортивную общественность.',
        content: `# Шоэй Отани — двусторонний MVP МЛБ

## Уникальные достижения

Шоэй Отани продолжает переписывать историю бейсбола, став первым игроком, который одновременно является **элитным питчером** и одним из лучших отбивающих в лиге.

Его показатели впечатляют:
- **3.14 ERA** на горе
- **OPS 1.066** на бите
- **44 хоум-рана** за сезон`,
        image: '/images/hero-MLB.png',
        status: 'published',
        featured: true,
        authorId: author.id,
        categoryId: categories[2].id,
        publishedAt: new Date('2024-05-20'),
        seoTitle: 'Шоэй Отани — двусторонний MVP МЛБ',
        seoDesc: 'Японская звезда бейсбола Шоэй Отани стал первым двусторонним MVP в истории лиги.',
        seoKeywords: 'Отани, МЛБ, MVP, бейсбол, MLB',
        tagIndices: [4, 7],
      },
      {
        title: 'Эксклюзивное интервью с тренером Билл Беличик',
        slug: 'eksklyuzivnoe-intervyu-s-trenerom-bill-belichik',
        excerpt: 'Легендарный тренер НФЛ рассказал о своих методах подготовки и будущем футбола.',
        content: `# Интервью: Билл Беличик о будущем НФЛ

## Шесть чемпионатов и ни капли высокомерия

Билл Беличик, один из самых успешных тренеров в истории НФЛ, дал эксклюзивное интервью нашему порталу.

> «Каждый сезон — это новая книга. Вы не можете просто переписать старую», — поделился Беличик.

## О тактике

Шестикратный победитель Супербоула подробно рассказал об эволюции тактики в американском футболе и том, как аналитика меняет подготовку команд.`,
        image: null,
        status: 'published',
        featured: false,
        authorId: editor.id,
        categoryId: categories[6].id,
        publishedAt: new Date('2024-06-10'),
        seoTitle: 'Интервью с Биллом Беличиком о будущем НФЛ',
        seoDesc: 'Эксклюзивное интервью с легендарным тренером НФЛ Биллом Беличиком.',
        seoKeywords: 'Беличик, НФЛ, интервью, тактика, тренер',
        tagIndices: [],
      },
      {
        title: 'Фэнтези футбол: Топ-10 игроков для драфта 2024',
        slug: 'fantasy-futbol-top-10-igrokov-dlya-drafta-2024',
        excerpt: 'Полное руководство по фэнтези драфту с анализом каждой позиции и стратегическими советами.',
        content: `# Фэнтези футбол 2024: Руководство по драфту

## Топ-10 игроков

1. **Кристиан Маккаффри** (RB, San Francisco)
2. **Джастин Джефферсон** (WR, Minnesota)
3. **Тайри Хилл** (WR, Miami)
4. **Джош Аллен** (QB, Buffalo)
5. **Патрик Махомс** (QB, Kansas City)

## Стратегические советы

Не забывайте про «zero-RB» стратегию в PPR лигах!`,
        image: null,
        status: 'draft',
        featured: false,
        authorId: author.id,
        categoryId: categories[7].id,
        publishedAt: null,
        seoTitle: 'Фэнтези футбол 2024: топ-10 игроков для драфта',
        seoDesc: 'Полное руководство по фэнтези драфту НФЛ 2024 с рейтингами и стратегиями.',
        seoKeywords: 'фэнтези, драфт, НФЛ, рейтинг, стратегия',
        tagIndices: [9],
      },
      {
        title: 'Грандиозный обмен: Давин Адамс перешёл в Нью-Йорк Джетс',
        slug: 'grandioznyj-obmen-davin-adams-pereshel-v-nju-jork-dzhets',
        excerpt: 'Один из крупнейших обменов сезона НФЛ потряс спортивный мир.',
        content: `# Давин Адамс — новый игрок Нью-Йорк Джетс

## Детали обмена

Звёздный ресивер **Давин Адамс** был обменян в Нью-Йорк Джетс в сделке, которая включала несколько пиков драфта.

Этот трансфер кардинально меняет баланс сил в **AFC East** и делает Джетс серьёзным претендентом на плей-офф.`,
        image: null,
        status: 'published',
        featured: false,
        authorId: editor.id,
        categoryId: categories[4].id,
        publishedAt: new Date('2024-07-05'),
        seoTitle: 'Давин Адамс перешёл в Нью-Йорк Джетс — детали обмена',
        seoDesc: 'Крупнейший обмен НФЛ: Давин Адамс стал игроком Нью-Йорк Джетс.',
        seoKeywords: 'Адамс, Джетс, обмен, НФЛ, трансфер',
        tagIndices: [3],
      },
      {
        title: 'НБА: Драфт 2024 — полная аналитика по пикам первого раунда',
        slug: 'nba-draft-2024-polnaya-analitika-po-pikam-pervogo-raunda',
        excerpt: 'Детальный разбор каждого пика первого раунда драфта НБА 2024 года с прогнозами экспертов.',
        content: `# НБА Драфт 2024: Полная аналитика

## Первый раунд — пик за пиком

Драфт НБА 2024 подарил множество сюрпризов и интригующих выборов.

### Топ-5 пиков
1. **Атланта Хокс** — Zaccharie Risacher (F, Франция)
2. **Вашингтон Уизардс** — Alex Sarr (C, Франция)
3. **Хьюстон Рокетс** — Reed Sheppard (G, Kentucky)`,
        image: null,
        status: 'draft',
        featured: false,
        authorId: admin.id,
        categoryId: categories[1].id,
        publishedAt: null,
        seoTitle: 'НБА Драфт 2024: полная аналитика первого раунда',
        seoDesc: 'Подробный разбор каждого пика первого раунда драфта НБА 2024.',
        seoKeywords: 'НБА, драфт, пик, аналитика, rookies',
        tagIndices: [1],
      },
      {
        title: 'НФЛ: Обзор предсезонных трансферов и их влияние',
        slug: 'nfl-obzor-predsezonnyh-transferov-i-ih-vliyanie',
        excerpt: 'Как ключевые переходы игроков изменят расстановку сил в НФЛ.',
        content: `# Предсезонные трансферы НФЛ 2024

## Ключевые переходы

Предсезонный период НФЛ сопровождался беспрецедентным количеством громких переходов.

### Топ-5 трансферов
1. **Давин Адамс** → NY Jets
2. **Кирк Казинс** → Atlanta Falcons
3. **Сакун Баркли** → Philadelphia Eagles
4. **Деррик Генри** → Baltimore Ravens
5. **Кристиан Уилкинс** → Miami Dolphins`,
        image: null,
        status: 'published',
        featured: false,
        authorId: author.id,
        categoryId: categories[4].id,
        publishedAt: new Date('2024-08-15'),
        seoTitle: 'Трансферы НФЛ 2024: обзор и аналитика влияния',
        seoDesc: 'Полный обзор предсезонных трансферов НФЛ 2024 и их влияние на расстановку сил.',
        seoKeywords: 'НФЛ, трансферы, обмены, предсезонье, аналитика',
        tagIndices: [3],
      },
      {
        title: 'НХЛ: Звёздные новички сезона и их влияние на лигу',
        slug: 'nhl-zvezdnye-novichki-sezona-i-ih-vliyanie-na-ligu',
        excerpt: 'Знакомство с самым талантливым поколением новичков НХЛ за последнее десятилетие.',
        content: `# Новички НХЛ: Новое поколение звёзд

Этот сезон НХЛ подарил фанатам невероятно талантливое поколение новичков. От **Коннора Бедарда** до **Логана Кули** — молодые игроки меняют лицо лиги.`,
        image: null,
        status: 'draft',
        featured: false,
        authorId: author.id,
        categoryId: categories[3].id,
        publishedAt: null,
        seoTitle: 'Новички НХЛ: звёздное поколение сезона',
        seoDesc: 'Обзор самых талантливых новичков НХЛ текущего сезона.',
        seoKeywords: 'НХЛ, новички, Бедард, rookies',
        tagIndices: [8],
      },
      {
        title: 'МЛБ: Предсказания на вторую половину сезона',
        slug: 'mlb-predskazaniya-na-vtoruyu-polovinu-sezona',
        excerpt: 'Экспертный анализ того, что нас ждёт во второй половине сезона бейсбола.',
        content: `# МЛБ: Вторая половина сезона

## Тренды первой половины

Первая половина сезона МЛБ выдалась насыщенной сенсациями. Мы проанализировали тренды, статистику команд и игроков, чтобы сделать прогнозы на вторую половину чемпионата.`,
        image: null,
        status: 'draft',
        featured: false,
        authorId: editor.id,
        categoryId: categories[2].id,
        publishedAt: null,
        seoTitle: 'МЛБ: прогнозы на вторую половину сезона',
        seoDesc: 'Экспертный прогноз на вторую половину сезона МЛБ.',
        seoKeywords: 'МЛБ, прогнозы, бейсбол, сезон',
        tagIndices: [7],
      },
      {
        title: 'НФЛ: Травмы звёздных игроков — полный обзор',
        slug: 'nfl-travmy-zvezdnyh-igrokov-polnyj-obzor',
        excerpt: 'Как травмы ключевых игроков повлияли на старт сезона НФЛ.',
        content: `# Травмы в НФЛ: Сезон 2024

## Ключевые потери

Сезон 2024 начался с череды травм звёздных игроков, которые серьёзно повлияли на перспективы их команд.

### Наиболее значимые травмы
- **Джо Берроу** (Cincinnati Bengals) — кисть
- **Энтони Ричардсон** (Indianapolis Colts) — плечо
- **Ник Чабб** (Cleveland Browns) — колено

## Влияние на ставки и прогнозы

Травмы звёздных игроков напрямую влияют на линии букмекеров и ожидания фанатов.`,
        image: null,
        status: 'published',
        featured: true,
        authorId: admin.id,
        categoryId: categories[5].id,
        publishedAt: new Date('2024-09-10'),
        seoTitle: 'Травмы в НФЛ 2024: полный обзор и влияние на сезон',
        seoDesc: 'Обзор травм звёздных игроков НФЛ и их влияние на результаты команд.',
        seoKeywords: 'НФЛ, травмы, игроки, сезон, прогнозы',
        tagIndices: [2],
      },
      {
        title: 'НБА: Кто станет MVP сезона 2024/25?',
        slug: 'nba-kto-stanet-mvp-sezona-2024-25',
        excerpt: 'Рассматриваем главных претендентов на звание самого ценного игрока НБА.',
        content: `# MVP НБА 2024/25: Главные претенденты

## Фавориты гонки

### Никола Йокич
Сербский центровой продолжает показывать элитную статистику и является главным фаворитом букмекеров.

### Шей Гилджес-Александер
Канадец прогрессирует каждый сезон и стал одним из лучших игроков лиги.

### Лука Дончик
Словенец набирает трой-дабл за трой-даблом и ведёт «Даллас» к победам.`,
        image: null,
        status: 'published',
        featured: false,
        authorId: author.id,
        categoryId: categories[1].id,
        publishedAt: new Date('2024-10-20'),
        seoTitle: 'MVP НБА 2024/25: главные претенденты и прогнозы',
        seoDesc: 'Обзор главных претендентов на звание MVP НБА сезона 2024/25.',
        seoKeywords: 'НБА, MVP, Йокич, Дончик, сезон',
        tagIndices: [4, 6],
      },
      {
        title: 'Фэнтези футбол: Стратегии на вторую половину сезона',
        slug: 'fantasy-futbol-strategii-na-vtoruyu-polovinu-sezona',
        excerpt: 'Как адаптировать фэнтези-стратегию после травм и неожиданных результатов первой половины.',
        content: `# Фэнтези футбол: Адаптация стратегии

## Трансферы на waivers

Ключевые игроки для подбора в фэнтези-лигах во второй половине сезона.

## Трейд-стратегии

Как выгодно обменять переоценённых игроков до дедлайна трейдов.`,
        image: null,
        status: 'published',
        featured: false,
        authorId: author.id,
        categoryId: categories[7].id,
        publishedAt: new Date('2024-10-30'),
        seoTitle: 'Фэнтези футбол: стратегии на вторую половину сезона',
        seoDesc: 'Советы по адаптации фэнтези-стратегии во второй половине сезона НФЛ.',
        seoKeywords: 'фэнтези, стратегия, waivers, трейды, НФЛ',
        tagIndices: [9],
      },
    ]

    const createdNews: { id: string }[] = []
    for (const item of newsData) {
      const news = await db.news.create({
        data: {
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          image: item.image,
          status: item.status,
          featured: item.featured,
          authorId: item.authorId,
          categoryId: item.categoryId,
          publishedAt: item.publishedAt,
          seoTitle: item.seoTitle,
          seoDesc: item.seoDesc,
          seoKeywords: item.seoKeywords,
        },
      })
      createdNews.push(news)

      // Create news-tag relations
      for (const tagIdx of item.tagIndices) {
        await db.newsTag.create({
          data: {
            newsId: news.id,
            tagId: tags[tagIdx].id,
          },
        })
      }
    }

    // ===== PAGES (4) =====
    const pages = await Promise.all([
      db.page.create({
        data: {
          title: 'О нас',
          slug: 'o-nas',
          content: `# О нас

**US Sports Hub** — элитный спортивный медиапортал, посвящённый американскому спорту.

## Наша миссия

Мы предоставляем качественный контент о **NFL**, **NBA**, **MLB** и **NHL** для русскоязычных фанатов американского спорта.

## Команда

Наша команда состоит из опытных спортивных журналистов и аналитиков, которые ежедневно следят за событиями в мире американского спорта.`,
          status: 'published',
          order: 1,
          seoTitle: 'О нас — US Sports Hub',
          seoDesc: 'Узнайте больше о команде US Sports Hub и нашей миссии.',
        },
      }),
      db.page.create({
        data: {
          title: 'Контакты',
          slug: 'kontakty',
          content: `# Контакты

## Связаться с нами

- **Email:** info@ussportshub.com
- **Телефон:** +1 (555) 123-4567
- **Адрес:** New York, NY, USA

Для сотрудничества и рекламных предложений пишите на **ads@ussportshub.com**.`,
          status: 'published',
          order: 2,
          seoTitle: 'Контакты — US Sports Hub',
          seoDesc: 'Свяжитесь с редакцией US Sports Hub.',
        },
      }),
      db.page.create({
        data: {
          title: 'Реклама',
          slug: 'reklama',
          content: `# Реклама на US Sports Hub

## Возможности

Мы предлагаем различные форматы рекламы для вашего бренда:

- **Баннерная реклама** — на всех страницах портала
- **Спонсорские статьи** — нативный контент
- **Видео-интеграции** — в рамках наших видео-материалов
- **Email-рассылка** — более 50 000 подписчиков

Для получения медиа-кита пишите на **ads@ussportshub.com**`,
          status: 'published',
          order: 3,
          seoTitle: 'Реклама на US Sports Hub',
          seoDesc: 'Размещение рекламы на спортивном портале US Sports Hub.',
        },
      }),
      db.page.create({
        data: {
          title: 'Политика конфиденциальности',
          slug: 'politika-konfidenczialnosti',
          content: `# Политика конфиденциальности

## Сбор данных

Мы собираем минимально необходимый объём данных для обеспечения работы портала.

## Использование cookies

Наш портал использует cookies для персонализации и аналитики.

## Третьи стороны

Мы не передаём ваши персональные данные третьим лицам без вашего согласия.`,
          status: 'published',
          order: 4,
          seoTitle: 'Политика конфиденциальности — US Sports Hub',
          seoDesc: 'Политика конфиденциальности и обработки данных US Sports Hub.',
        },
      }),
    ])

    // ===== COMMENTS (8) =====
    const commentStatuses = ['approved', 'approved', 'approved', 'approved', 'approved', 'pending', 'pending', 'rejected']
    const comments = await Promise.all([
      db.comment.create({
        data: {
          content: 'Отличная статья! Махомс действительно невероятен.',
          authorId: admin.id,
          newsId: createdNews[0].id,
          status: 'approved',
        },
      }),
      db.comment.create({
        data: {
          content: 'Леброн — живая легенда! Заслужил этот рекорд на 100%.',
          authorId: editor.id,
          newsId: createdNews[1].id,
          status: 'approved',
        },
      }),
      db.comment.create({
        data: {
          content: 'Интересный анализ. Согласен с оценкой Кейла Уильямса.',
          authorId: author.id,
          newsId: createdNews[2].id,
          status: 'approved',
        },
      }),
      db.comment.create({
        data: {
          content: 'Отани — феномен! Не верю, что такое возможно в современном бейсболе.',
          authorId: admin.id,
          newsId: createdNews[4].id,
          status: 'approved',
        },
      }),
      db.comment.create({
        data: {
          content: 'Беличик — гений тактики. Его интервью всегда на уровне.',
          authorId: author.id,
          newsId: createdNews[5].id,
          status: 'approved',
        },
      }),
      db.comment.create({
        data: {
          content: 'Адамс в Джетс — это бомба! Жду начала сезона с нетерпением.',
          authorId: editor.id,
          newsId: createdNews[7].id,
          status: 'pending',
        },
      }),
      db.comment.create({
        data: {
          content: 'Травмы Берроу — это катастрофа для Бенгалс. Сезон может быть провальным.',
          authorId: author.id,
          newsId: createdNews[12].id,
          status: 'pending',
        },
      }),
      db.comment.create({
        data: {
          content: 'Не согласен с рейтингом. Дончик должен быть №1 в гонке MVP.',
          authorId: admin.id,
          newsId: createdNews[13].id,
          status: 'rejected',
        },
      }),
    ])

    // ===== MEDIA (5) =====
    const mediaItems = await Promise.all([
      db.media.create({
        data: {
          filename: 'hero-NFL.png',
          alt: 'NFL — Американский футбол',
          mimeType: 'image/png',
          size: 245760,
          width: 1920,
          height: 1080,
          url: '/images/hero-NFL.png',
          folder: '/images',
        },
      }),
      db.media.create({
        data: {
          filename: 'hero-NBA.png',
          alt: 'NBA — Баскетбол',
          mimeType: 'image/png',
          size: 230400,
          width: 1920,
          height: 1080,
          url: '/images/hero-NBA.png',
          folder: '/images',
        },
      }),
      db.media.create({
        data: {
          filename: 'hero-MLB.png',
          alt: 'MLB — Бейсбол',
          mimeType: 'image/png',
          size: 215040,
          width: 1920,
          height: 1080,
          url: '/images/hero-MLB.png',
          folder: '/images',
        },
      }),
      db.media.create({
        data: {
          filename: 'hero-NHL.png',
          alt: 'NHL — Хоккей',
          mimeType: 'image/png',
          size: 208896,
          width: 1920,
          height: 1080,
          url: '/images/hero-NHL.png',
          folder: '/images',
        },
      }),
      db.media.create({
        data: {
          filename: 'studio-bg.png',
          alt: 'Фон студии',
          mimeType: 'image/png',
          size: 512000,
          width: 2560,
          height: 1440,
          url: '/images/studio-bg.png',
          folder: '/images',
        },
      }),
    ])

    // ===== MENU ITEMS (8) =====
    await Promise.all([
      // Main menu (5)
      db.menuItem.create({ data: { label: 'Главная', url: '/', menuType: 'main', order: 1 } }),
      db.menuItem.create({ data: { label: 'Новости', url: '/news', menuType: 'main', order: 2 } }),
      db.menuItem.create({ data: { label: 'Трансферы', url: '/transfery', menuType: 'main', order: 3 } }),
      db.menuItem.create({ data: { label: 'Аналитика', url: '/analitika', menuType: 'main', order: 4 } }),
      db.menuItem.create({ data: { label: 'Фэнтези', url: '/fantasy', menuType: 'main', order: 5 } }),
      // Footer menu (4)
      db.menuItem.create({ data: { label: 'О нас', url: '/o-nas', pageId: pages[0].id, menuType: 'footer', order: 1 } }),
      db.menuItem.create({ data: { label: 'Контакты', url: '/kontakty', pageId: pages[1].id, menuType: 'footer', order: 2 } }),
      db.menuItem.create({ data: { label: 'Реклама', url: '/reklama', pageId: pages[2].id, menuType: 'footer', order: 3 } }),
      db.menuItem.create({ data: { label: 'Политика конфиденциальности', url: '/politika-konfidenczialnosti', pageId: pages[3].id, menuType: 'footer', order: 4 } }),
    ])

    // ===== SETTINGS (12) =====
    const settingsData = [
      { key: 'site_name', value: 'US Sports Hub', group: 'general', type: 'text' },
      { key: 'site_description', value: 'Элитный спортивный медиа-портал — освещение NFL, NBA, MLB, NHL с глубокой аналитикой и интерактивной статистикой.', group: 'general', type: 'textarea' },
      { key: 'site_url', value: 'https://ussportshub.com', group: 'general', type: 'text' },
      { key: 'logo_url', value: '/images/logo.png', group: 'general', type: 'text' },
      { key: 'seo_title', value: 'US Sports Hub — Элитный спортивный опыт', group: 'seo', type: 'text' },
      { key: 'seo_desc', value: 'Последние спортивные новости, аналитика, статистика и экспертные мнения о NFL, NBA, MLB, NHL.', group: 'seo', type: 'textarea' },
      { key: 'seo_keywords', value: 'спорт, NFL, NBA, MLB, NHL, аналитика, новости', group: 'seo', type: 'text' },
      { key: 'robots_meta', value: 'index', group: 'seo', type: 'select' },
      { key: 'default_theme', value: 'dark', group: 'appearance', type: 'select' },
      { key: 'news_per_page', value: '12', group: 'appearance', type: 'number' },
      { key: 'show_breaking_news', value: 'true', group: 'appearance', type: 'switch' },
      { key: 'show_live_ticker', value: 'true', group: 'appearance', type: 'switch' },
      { key: 'notify_comments', value: 'true', group: 'notifications', type: 'switch' },
      { key: 'notify_users', value: 'false', group: 'notifications', type: 'switch' },
      { key: 'notify_weekly', value: 'false', group: 'notifications', type: 'switch' },
    ]

    await Promise.all(
      settingsData.map((s) =>
        db.setting.create({ data: s })
      )
    )

    // ===== ACTIVITY LOGS (10) =====
    const activityLogs = [
      { action: 'news_created', entity: 'news', entityId: createdNews[0].id, details: 'Создана новость «Канзас-Сити Чифс победили в Супербоуле LVIII»', userId: admin.id },
      { action: 'news_published', entity: 'news', entityId: createdNews[0].id, details: 'Опубликована новость «Канзас-Сити Чифс победили в Супербоуле LVIII»', userId: admin.id },
      { action: 'news_created', entity: 'news', entityId: createdNews[1].id, details: 'Создана новость «Леброн Джеймс побил рекорд по очкам»', userId: editor.id },
      { action: 'user_created', entity: 'user', entityId: author.id, details: 'Зарегистрирован новый пользователь «Спортивный журналист»', userId: admin.id },
      { action: 'comment_created', entity: 'comment', entityId: comments[0].id, details: 'Новый комментарий к новости «Канзас-Сити Чифс победили в Супербоуле LVIII»', userId: admin.id },
      { action: 'page_created', entity: 'page', entityId: pages[0].id, details: 'Создана страница «О нас»', userId: admin.id },
      { action: 'settings_updated', entity: 'settings', details: 'Обновлены общие настройки сайта', userId: admin.id },
      { action: 'media_uploaded', entity: 'media', entityId: mediaItems[0].id, details: 'Загружен файл hero-NFL.png', userId: editor.id },
      { action: 'news_created', entity: 'news', entityId: createdNews[4].id, details: 'Создана новость «Шоэй Отани — первый двусторонний MVP»', userId: author.id },
      { action: 'comment_approved', entity: 'comment', entityId: comments[1].id, details: 'Одобрен комментарий к новости «Леброн Джеймс побил рекорд»', userId: admin.id },
    ]

    await Promise.all(
      activityLogs.map((log, idx) =>
        db.activityLog.create({
          data: {
            ...log,
            createdAt: new Date(Date.now() - (activityLogs.length - idx) * 3600000),
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      counts: {
        users: 3,
        categories: 8,
        tags: 10,
        news: 15,
        pages: 4,
        comments: 8,
        media: 5,
        menuItems: 9,
        settings: 15,
        activityLogs: 10,
      },
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
