import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST /api/admin/seed - Clear and re-seed database with mock data
export async function POST() {
  try {
    // Clear existing data in reverse dependency order
    await db.news.deleteMany()
    await db.category.deleteMany()
    await db.user.deleteMany()

    // Create users
    const admin = await db.user.create({
      data: {
        email: 'admin@sportshub.com',
        name: 'Администратор',
        role: 'admin',
      },
    })

    const editor = await db.user.create({
      data: {
        email: 'editor@sportshub.com',
        name: 'Редактор СпортХаб',
        role: 'editor',
      },
    })

    // Create categories
    const categories = await Promise.all([
      db.category.create({ data: { name: 'NFL', slug: 'nfl', color: '#dc2626', order: 1 } }),
      db.category.create({ data: { name: 'NBA', slug: 'nba', color: '#ea580c', order: 2 } }),
      db.category.create({ data: { name: 'MLB', slug: 'mlb', color: '#2563eb', order: 3 } }),
      db.category.create({ data: { name: 'NHL', slug: 'nhl', color: '#06b6d4', order: 4 } }),
      db.category.create({ data: { name: 'Трансферы', slug: 'transferы', color: '#a855f7', order: 5 } }),
      db.category.create({ data: { name: 'Аналитика', slug: 'analitika', color: '#10b981', order: 6 } }),
      db.category.create({ data: { name: 'Интервью', slug: 'intervьu', color: '#f59e0b', order: 7 } }),
      db.category.create({ data: { name: 'Фэнтези', slug: 'fantasy', color: '#ec4899', order: 8 } }),
    ])

    // Create news items with Russian content
    const newsItems = [
      {
        title: 'Канзас-Сити Чифс победили в Супербоуле LVIII',
        slug: 'kanzas-siti-chifs-pobedili-v-superboul-lviii',
        excerpt: 'Патрик Махомс привёл свою команду к победе в напряжённом матче, установив новый рекорд Супербоула по передачам.',
        content: 'В финальном матче сезона НФЛ Канзас-Сити Чифс одержали победу над Сан-Франциско Форти Найнерс. Патрик Махомс продемонстрировал выдающуюся игру, завершив матч с 333 ярдами на пасах и 2 тачдаунами. Матч продлился до овертайма, где Чифс сумели забить решающий тачдаун и secured победу.',
        image: '/images/hero-NFL.png',
        status: 'published',
        featured: true,
        authorId: admin.id,
        categoryId: categories[0].id,
        publishedAt: new Date('2024-02-11'),
      },
      {
        title: 'Леброн Джеймс побил рекорд по очкам за карьеру в НБА',
        slug: 'lebron-dzheims-pobil-rekord-po-ochkam-za-kareru',
        excerpt: 'Леброн Джеймс превзошёл Карима Абдул-Джаббара, став лучшим бомбардиром в истории НБА.',
        content: 'Леброн Джеймс из Лос-Анджелес Лейкерс установил новый рекорд НБА по количеству набранных очков за карьеру, превзойдя легендарный показатель Карима Абдул-Джаббара. Этот исторический момент состоялся в матче против Оклахома-Сити Тандер.',
        image: '/images/hero-NBA.png',
        status: 'published',
        featured: true,
        authorId: editor.id,
        categoryId: categories[1].id,
        publishedAt: new Date('2024-03-01'),
      },
      {
        title: 'Анализ: Лучшие новички драфта НФЛ 2024',
        slug: 'analiz-luchshie-novichki-drafta-nfl-2024',
        excerpt: 'Разбор выступлений самых ярких дебютантов сезона, включая Кейла Уильямса и Кейдена Бойса.',
        content: 'Сезон 2024 подарил фанатам НФЛ целый ряд выдающихся новичков. Кейл Уильямс показал впечатляющие результаты на позиции квотербека, а Кейден Бойс стал одним из самых продуктивных ресиверов лиги. В этой статье мы анализируем статистику и перспективы каждого из них.',
        image: null,
        status: 'published',
        featured: false,
        authorId: admin.id,
        categoryId: categories[5].id,
        publishedAt: new Date('2024-04-15'),
      },
      {
        title: 'НХЛ: торонтский финал Кубка Стэнли по прогнозам экспертов',
        slug: 'nhl-torontskij-final-kubka-stenli',
        excerpt: 'Эксперты предсказывают один из самых захватывающих финалов Кубка Стэнли за последние годы.',
        content: 'По мере приближения плей-офф НХЛ, эксперты сходятся во мнении, что этот сезон может подарить один из самых захватывающих финалов Кубка Стэнли. Мы проанализировали шансы всех претендентов и выявили фаворитов.',
        image: '/images/hero-NHL.png',
        status: 'draft',
        featured: false,
        authorId: editor.id,
        categoryId: categories[3].id,
        publishedAt: null,
      },
      {
        title: 'МЛБ: Шоэй Отани стал первым двусторонним игроком-МВП',
        slug: 'mlb-shoehi-otani-stal-pervym-dvustoronnim-igrokom-mvp',
        excerpt: 'Уникальное достижение японской звезды бейсбола покорило всю спортивную общественность.',
        content: 'Шоэй Отани продолжает переписывать историю бейсбола, став первым игроком, который одновременно является элитным питчером и одним из лучших отбивающих в лиге. Его показатели本赛季 впечатляют: 3.14 ERA на горе и OPS 1.066 на бите.',
        image: '/images/hero-MLB.png',
        status: 'published',
        featured: true,
        authorId: admin.id,
        categoryId: categories[2].id,
        publishedAt: new Date('2024-05-20'),
      },
      {
        title: 'Эксклюзивное интервью с тренером Билл Беличик',
        slug: 'eksklyuzivnoe-intervyu-s-trenerom-bill-belichik',
        excerpt: 'Легендарный тренер НФЛ рассказал о своих методах подготовки и будущем футбола.',
        content: 'Билл Беличик, один из самых успешных тренеров в истории НФЛ, дал эксклюзивное интервью нашему порталу. Шестькратный победитель Супербоула поделился своими мыслями об эволюции игры и перспективах развития тактики в американском футболе.',
        image: null,
        status: 'published',
        featured: false,
        authorId: editor.id,
        categoryId: categories[6].id,
        publishedAt: new Date('2024-06-10'),
      },
      {
        title: 'Фэнтези футбол: Топ-10 игроков для драфта 2024',
        slug: 'fantasy-futbol-top-10-igrokov-dlya-drafta-2024',
        excerpt: 'Полное руководство по фэнтези драфту с анализом каждой позиции и стратегическими советами.',
        content: 'Подготовка к фэнтези сезону 2024 уже в самом разгаре. Наш аналитический отдел составил подробный рейтинг топ-10 игроков для драфта, учитывая статистику прошлого сезона, изменения в составе команд и перспективы на будущий год.',
        image: null,
        status: 'draft',
        featured: false,
        authorId: admin.id,
        categoryId: categories[7].id,
        publishedAt: null,
      },
      {
        title: 'Грандиозный обмен: Давин Адамс перешёл в Нью-Йорк Джетс',
        slug: 'grandioznyj-obmen-davin-adams-pereshel-v-nju-jork-dzhets',
        excerpt: 'Один из крупнейших обменов сезона НФЛ потряс спортивный мир.',
        content: 'Звёздный ресивер Давин Адамс был обменян в Нью-Йорк Джетс в сделке, которая включала несколько пиков драфта. Этот трансфер кардинально меняет баланс сил в AFC East и делает Джетс серьёзным претендентом на плей-офф.',
        image: null,
        status: 'published',
        featured: false,
        authorId: editor.id,
        categoryId: categories[4].id,
        publishedAt: new Date('2024-07-05'),
      },
      {
        title: 'НБА: Драфт 2024 — полная аналитика по пикам первого раунда',
        slug: 'nba-draft-2024-polnaya-analitika-po-pikam-pervogo-raunda',
        excerpt: 'Детальный разбор каждого пика первого раунда драфта НБА 2024 года с прогнозами экспертов.',
        content: 'Драфт НБА 2024 подарил множество сюрпризов и интригующих выборов. Мы детально анализируем каждый пик первого раунда, оцениваем потенциал новичков и делаем прогнозы об их влиянии на лигу.',
        image: null,
        status: 'draft',
        featured: false,
        authorId: admin.id,
        categoryId: categories[1].id,
        publishedAt: null,
      },
      {
        title: 'НФЛ: Обзор предсезонных трансферов и их влияние на ставки',
        slug: 'nfl-obzor-predsezonnyh-transferov-i-ih-vliyanie-na-stavki',
        excerpt: 'Как ключевые переходы игроков изменят расстановку сил в НФЛ.',
        content: 'Предсезонный период НФЛ сопровождался беспрецедентным количеством громких переходов. В этом аналитическом обзоре мы оцениваем влияние каждого значимого трансфера на перспективы команд и их шансы в гонке за плей-офф.',
        image: null,
        status: 'published',
        featured: false,
        authorId: editor.id,
        categoryId: categories[4].id,
        publishedAt: new Date('2024-08-15'),
      },
      {
        title: 'НХЛ: Звёздные новички сезона и их влияние на лигу',
        slug: 'nhl-zvezdnye-novichki-sezona-i-ih-vliyanie-na-ligu',
        excerpt: 'Знакомство с самым талантливым поколением новичков НХЛ за последнее десятилетие.',
        content: 'Этот сезон НХЛ подарил фанатам невероятно талантливое поколение новичков. От Коннора Бедарда до Логана Кули — молодые игроки меняют лицо лиги и приносят новые рекорды.',
        image: null,
        status: 'draft',
        featured: false,
        authorId: admin.id,
        categoryId: categories[3].id,
        publishedAt: null,
      },
      {
        title: 'МЛБ: Предсказания на вторую половину сезона',
        slug: 'mlb-predskazaniya-na-vtoruyu-polovinu-sezona',
        excerpt: 'Экспертный анализ того, что нас ждёт во второй половине сезона бейсбола.',
        content: 'Первая половина сезона МЛБ выдалась насыщенной сенсациями. Мы проанализировали тренды, статистику команд и игроков, чтобы сделать прогнозы на вторую половину чемпионата.',
        image: null,
        status: 'draft',
        featured: false,
        authorId: editor.id,
        categoryId: categories[2].id,
        publishedAt: null,
      },
    ]

    const createdNews = await Promise.all(
      newsItems.map((item) =>
        db.news.create({
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
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      counts: {
        users: 2,
        categories: 8,
        news: 12,
      },
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 })
  }
}
