"use client"

import { useState } from 'react'
import { Loader2, RefreshCw, FileText, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ToastAction } from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

export default function ScraperPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const { toast } = useToast()

  const handleScrape = async (saveToDb: boolean) => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/scraper/nhl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ saveToDb }),
      })

      const data = await res.json()

      if (data.success) {
        setResult(data)
        toast({
          title: 'Парсинг завершён',
          description: `Найдено: ${data.scraped}, Сохранено: ${data.saved}`,
        })
      } else {
        throw new Error(data.error || 'Ошибка')
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка парсинга',
        description: error.message,
        action: <ToastAction altText="Попробовать снова">Попробовать снова</ToastAction>,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/admin/scraper/nhl')
      const data = await res.json()

      if (data.success) {
        setResult(data)
        toast({
          title: 'Тест завершён',
          description: `Найдено ${data.count} статей (без сохранения)`,
        })
      } else {
        throw new Error(data.error || 'Ошибка')
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Ошибка теста',
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Парсер новостей</h1>
        <p className="text-sm text-gray-500 mt-1">
          Импорт новостей с CBS Sports NHL
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Тестовый запрос</CardTitle>
            <CardDescription>Проверить доступность сайта</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTest}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="size-4 mr-2" />
              )}
              Протестировать
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Сохранить как черновики</CardTitle>
            <CardDescription>Для проверки перед публикацией</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => handleScrape(true)}
              disabled={loading}
              className="w-full bg-yellow-600 hover:bg-yellow-700"
            >
              {loading ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <FileText className="size-4 mr-2" />
              )}
              Парсить и сохранять
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Статистика</CardTitle>
            <CardDescription>Результат последнего запроса</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Найдено:</span>
                  <Badge variant="secondary">{result.scraped || result.count}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Сохранено:</span>
                  <Badge className="bg-green-600">{result.saved || 0}</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Нет данных</p>
            )}
          </CardContent>
        </Card>
      </div>

      {result?.articles && (
        <Card>
          <CardHeader>
            <CardTitle>Результаты парсинга</CardTitle>
            <CardDescription>
              {result.articles.length} статей найдено
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {result.articles.map((article: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  {article.image ? (
                    <img
                      src={article.image}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                      <FileText className="size-8 text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {article.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {article.category}
                      </Badge>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Открыть источник
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="size-5 text-yellow-600 shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-semibold mb-1">Важно:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Проверяйте черновики перед публикацией</li>
                <li>Не запускайте парсинг слишком часто</li>
                <li>Уважайте robots.txt сайта</li>
                <li>Данные предназначены только для тестирования</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
