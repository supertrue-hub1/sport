'use client'

import { useState, useEffect } from 'react'
import { ImageIcon as ImageIconAlt, X, Loader2, ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface MediaItem {
  id: string
  filename: string
  alt: string | null
  mimeType: string
  size: number
  width: number | null
  height: number | null
  url: string
  folder: string
  createdAt: string
}

interface MediaPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (url: string) => void
  currentUrl?: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaPicker({ open, onOpenChange, onSelect, currentUrl }: MediaPickerProps) {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      loadMedia()
      setSelectedId(null)
    }
  }, [open])

  const loadMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) {
        const data = await res.json()
        setMedia(data)
      }
    } catch {
      setMedia([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = media.filter((item) =>
    item.filename.toLowerCase().includes(search.toLowerCase()) ||
    (item.alt && item.alt.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSelect = (item: MediaItem) => {
    setSelectedId(item.id)
    onSelect(item.url)
  }

  const imageItems = filtered.filter((item) => item.mimeType.startsWith('image/'))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIconAlt className="size-5 text-blue-600" />
            Выбрать изображение
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 flex-1 min-h-0">
          <div className="relative">
            <Input
              placeholder="Поиск по файлам..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 border-gray-200 bg-gray-50 focus-visible:bg-white"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="size-8 animate-spin text-blue-600" />
            </div>
          ) : imageItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ImageIcon className="size-12 mb-3" aria-hidden="true" />
              <p className="text-sm font-medium">Нет изображений</p>
              <p className="text-xs mt-1">Загрузите файлы в медиатеку</p>
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-3">
                {imageItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      'group relative rounded-lg border-2 overflow-hidden transition-all hover:shadow-md',
                      selectedId === item.id
                        ? 'border-blue-600 shadow-md ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img
                        src={item.url}
                        alt={item.alt || item.filename || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {selectedId === item.id && (
                        <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                          <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-gray-700 truncate">{item.filename}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {item.width && item.height ? `${item.width}×${item.height}` : ''}
                        {item.width && item.height && ' · '}
                        {formatFileSize(item.size)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            {imageItems.length} {imageItems.length === 1 ? 'изображение' : imageItems.length < 5 ? 'изображения' : 'изображений'}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="border-gray-200">
              Отмена
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => onOpenChange(false)}
              disabled={!selectedId}
            >
              Выбрать
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
