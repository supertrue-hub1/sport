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

    console.log('Parsing HTML...')

    // Селектор 1: Стандартные карточки новостей
    $('[class*="ArticleCard"], [class*="article-card"], .article, article').each((_, el) => {
      const title = $(el).find('h3 a, h4 a, .title a, a.title').first().text().trim()
      const link = $(el).find('h3 a, h4 a, .title a, a.title').first().attr('href')
      const image = $(el).find('img').first().attr('src') || $(el).find('img').first().attr('data-src') || ''
      
      if (title && link && title.length > 10) {
        const category = $(el).find('[class*="CategoryChip"], .category, [class*="category"]').first().text().trim() || 'NHL'
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

    // Селектор 2: Если ничего не нашли, ищем все ссылки в контенте
    if (articles.length === 0) {
      $('main a, [class*="content"] a, .nhl-news a').each((_, el) => {
        const link = $(el).attr('href')
        const text = $(el).text().trim()
        
        if (link && text.length > 10 && text.length < 200 && 
            (link.includes('/nhl/') || link.includes('/news/'))) {
          articles.push({
            title: text,
            url: link.startsWith('http') ? link : `https://www.cbssports.com${link}`,
            image: '',
            category: 'NHL',
            excerpt: '',
            publishedAt: null,
          })
        }
      })
    }

    // Селектор 3: Ищем заголовки с классами новостей
    if (articles.length === 0) {
      $('h2, h3, h4').each((_, el) => {
        const title = $(el).text().trim()
        const link = $(el).find('a').first().attr('href') || $(el).parent('a').attr('href')
        
        if (title && link && title.length > 10 && title.length < 200) {
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
      const key = article.url.replace(/[^a-zA-Z0-9]/g, '')
      if (!unique.has(key)) {
        unique.set(key, article)
      }
    })

    const result = Array.from(unique.values()).slice(0, 15)
    console.log(`Found ${result.length} articles`)
    
    return result
  } catch (error) {
    console.error('Error scraping NHL news:', error)
    throw error
  }
}
