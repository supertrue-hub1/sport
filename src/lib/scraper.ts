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

    // Парсим основные новости
    $('[data-kylin-component="ArticleCard"]').each((_, el) => {
      const title = $(el).find('h3 a').first().text().trim()
      const link = $(el).find('h3 a').first().attr('href')
      const image = $(el).find('img').first().attr('src') || ''
      const category = $(el).find('[class*="CategoryChip"]').text().trim() || 'NHL'
      
      if (title && link) {
        articles.push({
          title,
          url: link.startsWith('http') ? link : `https://www.cbssports.com${link}`,
          image,
          category,
          excerpt: '',
          publishedAt: null,
        })
      }
    })

    // Альтернативный селектор для других блоков новостей
    if (articles.length === 0) {
      $('.nhl-news-item, .article-card, [class*="ArticleCard"]').each((_, el) => {
        const title = $(el).find('h3, h4, .title').first().text().trim()
        const link = $(el).find('a').first().attr('href')
        const image = $(el).find('img').first().attr('src') || ''
        
        if (title && link) {
          articles.push({
            title,
            url: link.startsWith('http') ? link : `https://www.cbssports.com${link}`,
            image,
            category: 'NHL',
            excerpt: '',
            publishedAt: null,
          })
        }
      })
    }

    // Ограничиваем 10 статьями
    return articles.slice(0, 10)
  } catch (error) {
    console.error('Error scraping NHL news:', error)
    throw error
  }
}
