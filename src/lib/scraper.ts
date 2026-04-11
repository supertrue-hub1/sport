import * as cheerio from 'cheerio'

export interface ScrapedNews {
  title: string
  url: string
  image: string
  category: string
  excerpt: string
  publishedAt: string | null
}

export async function scrapeNHLNews(): Promise<ScrapedNews[]> {
  // Парсим именно NHL раздел
  const url = 'https://www.cbssports.com/nhl/'
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const articles: ScrapedNews[] = []

    console.log('Parsing NHL news from cbssports.com/nhl/...')

    // Селектор 1: Карточки в NHL секции
    $('[class*="ArticleCard"], [class*="article-card"], .article-card, article[class*="nhl"]').each((_, el) => {
      // Проверяем что это NHL статья
      const parentClass = $(el).closest('[class*="nhl"], [class*="NHL"]').attr('class') || ''
      
      const titleEl = $(el).find('h3 a, h4 a, .title a, a.title, h3, h4').first()
      const title = titleEl.text().trim()
      const link = titleEl.attr('href')
      
      // Фильтр: только NHL ссылки
      if (!link || !link.includes('/nhl/')) {
        return
      }

      const image = $(el).find('img').first().attr('src') || 
                    $(el).find('img').first().attr('data-src') || 
                    $(el).find('[class*="Image"]').attr('data-src') || ''
      
      if (title && title.length > 10 && title.length < 200) {
        const category = 'NHL'
        articles.push({
          title,
          url: link.startsWith('http') ? link : `https://www.cbssports.com${link}`,
          image: image || '',
          category,
          excerpt: '',
          publishedAt: null,
        })
      }
    })

    // Селектор 2: Ссылки в main с /nhl/ в URL
    if (articles.length < 5) {
      $('main a, [class*="main-content"] a').each((_, el) => {
        const link = $(el).attr('href')
        const text = $(el).text().trim()
        
        // Строгий фильтр: только /nhl/ в URL
        if (!link || !link.includes('/nhl/') || !link.includes('/news/') && !link.includes('/standings/') && !link.includes('/teams/')) {
          return
        }
        
        if (text && text.length > 15 && text.length < 200 && !text.includes('Read more') && !text.includes('Click here')) {
          const image = $(el).closest('div').find('img').first().attr('src') || ''
          articles.push({
            title: text,
            url: link.startsWith('http') ? link : `https://www.cbssports.com${link}`,
            image: image || '',
            category: 'NHL',
            excerpt: '',
            publishedAt: null,
          })
        }
      })
    }

    // Селектор 3: Заголовки только в NHL секции
    if (articles.length < 5) {
      $('main h2, main h3, [class*="nhl"] h2, [class*="nhl"] h3').each((_, el) => {
        const title = $(el).text().trim()
        const link = $(el).find('a').first().attr('href') || $(el).parent('a').attr('href')
        
        if (!link || !link.includes('/nhl/')) {
          return
        }

        if (title && title.length > 15 && title.length < 200) {
          const image = $(el).closest('div').find('img').first().attr('src') || ''
          articles.push({
            title,
            url: link.startsWith('http') ? link : `https://www.cbssports.com${link}`,
            image: image || '',
            category: 'NHL',
            excerpt: '',
            publishedAt: null,
          })
        }
      })
    }

    // Убираем дубликаты по URL
    const unique = new Map<string, ScrapedNews>()
    articles.forEach(article => {
      // Нормализуем URL для проверки дубликатов
      const normalizedUrl = article.url.replace(/\/$/, '').split('?')[0]
      if (!unique.has(normalizedUrl)) {
        unique.set(normalizedUrl, article)
      }
    })

    const result = Array.from(unique.values()).slice(0, 15)
    console.log(`Found ${result.length} NHL articles`)
    
    // Логируем найденные статьи
    result.forEach((a, i) => console.log(`  ${i+1}. ${a.title.substring(0, 60)}...`))
    
    return result
  } catch (error) {
    console.error('Error scraping NHL news:', error)
    throw error
  }
}
