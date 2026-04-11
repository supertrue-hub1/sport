import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { scrapeNHLNews } from '@/lib/scraper'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { saveToDb = true } = body

    console.log('Starting NHL news scraping...')
    const articles = await scrapeNHLNews()
    console.log(`Scraped ${articles.length} articles`)

    if (!saveToDb) {
      return NextResponse.json({
        success: true,
        count: articles.length,
        articles,
      })
    }

    // Получаем категорию NHL или создаём
    let category = await db.category.findFirst({
      where: { slug: 'nhl-cbs' },
    })

    if (!category) {
      category = await db.category.create({
        data: {
          name: 'NHL (CBS)',
          slug: 'nhl-cbs',
          color: '#000000',
          order: 10,
        },
      })
    }

    // Получаем администратора
    const admin = await db.user.findFirst({
      where: { role: 'admin' },
    })

    const savedArticles = []

    for (const article of articles) {
      // Проверяем, есть ли уже статья с таким URL
      const existing = await db.news.findFirst({
        where: { slug: article.url.replace(/[^a-zA-Z0-9]/g, '-') },
      })

      if (existing) {
        console.log(`Skipping duplicate: ${article.title}`)
        continue
      }

      // Создаём slug из URL
      const slug = `cbs-nhl-${article.url.replace(/[^a-zA-Z0-9]/g, '-')}`

      const news = await db.news.create({
        data: {
          title: article.title,
          slug,
          excerpt: article.excerpt || article.title.substring(0, 150),
          content: `<p>Источник: <a href="${article.url}" target="_blank">CBS Sports NHL</a></p>`,
          image: article.image,
          status: 'draft', // Сохраняем как черновик для проверки
          categoryId: category.id,
          authorId: admin?.id || '1',
          publishedAt: null,
        },
      })

      savedArticles.push(news)
    }

    console.log(`Saved ${savedArticles.length} articles to database`)

    return NextResponse.json({
      success: true,
      scraped: articles.length,
      saved: savedArticles.length,
      articles: savedArticles,
    })
  } catch (error) {
    console.error('Error in NHL scraper:', error)
    return NextResponse.json(
      { error: 'Failed to scrape NHL news', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Тестовый запрос - просто возвращает данные без сохранения
  try {
    const articles = await scrapeNHLNews()
    return NextResponse.json({
      success: true,
      count: articles.length,
      articles,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to scrape', details: String(error) },
      { status: 500 }
    )
  }
}
