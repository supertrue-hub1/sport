'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Upload, Trash2, Search, Image as ImageIcon, File, X, Loader2, HardDrive, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'

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

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function isImage(mime: string) {
  return mime.startsWith('image/')
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) setMedia(await res.json())
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase()) ||
    (m.alt || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalSize = media.reduce((acc, m) => acc + m.size, 0)
  const imageCount = media.filter((m) => isImage(m.mimeType)).length

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('alt', file.name.replace(/\.[^.]+$/, ''))
        await fetch('/api/admin/media', { method: 'POST', body: formData })
      }
      await loadData()
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await fetch('/api/admin/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      })
      setMedia((prev) => prev.filter((m) => m.id !== deleteId))
      setDeleteId(null)
    } finally {
      setDeleting(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-48" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-48" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Медиатека</h1>
          <p className="text-sm text-gray-500 mt-1">
            {media.length} файлов &middot; {formatSize(totalSize)}
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Upload className="size-4 mr-2" />}
          Загрузить файлы
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <HardDrive className="size-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Всего файлов</p>
              <p className="text-lg font-bold text-gray-900">{media.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2">
              <ImageIcon className="size-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Изображений</p>
              <p className="text-lg font-bold text-gray-900">{imageCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <File className="size-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Документов</p>
              <p className="text-lg font-bold text-gray-900">{media.length - imageCount}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-2">
              <FolderOpen className="size-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Объём</p>
              <p className="text-lg font-bold text-gray-900">{formatSize(totalSize)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск по имени файла..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 pl-9 border-gray-200 bg-gray-50 focus-visible:bg-white"
        />
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-xl border-2 border-dashed transition-colors ${
          dragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-200 bg-gray-50 hover:border-gray-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <Upload className="size-10 text-gray-300 mb-3" />
          <p className="text-sm font-medium text-gray-600">
            Перетащите файлы сюда
          </p>
          <p className="text-xs text-gray-400 mt-1">
            или нажмите кнопку «Загрузить файлы» выше
          </p>
        </div>
      </div>

      {/* Media grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setPreviewItem(item)}
            >
              {/* Thumbnail */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                {isImage(item.mimeType) ? (
                  <img
                    src={item.url}
                    alt={item.alt || item.filename}
                    className="size-full object-cover group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <File className="size-10" />
                    <span className="text-[10px] uppercase font-medium">{item.mimeType.split('/')[1]}</span>
                  </div>
                )}
              </div>

              {/* Info overlay */}
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-900 truncate">{item.filename}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-gray-400">{formatSize(item.size)}</span>
                  {item.width && item.height && (
                    <span className="text-[10px] text-gray-400">{item.width}&times;{item.height}</span>
                  )}
                </div>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => { e.stopPropagation(); setDeleteId(item.id) }}
                className="absolute top-2 right-2 rounded-md bg-white/90 p-1.5 text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                aria-label="Удалить"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-gray-100 bg-white p-16 text-center">
          <ImageIcon className="size-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {search ? 'Ничего не найдено' : 'Медиатека пуста'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {search ? 'Попробуйте изменить поисковый запрос' : 'Загрузите первый файл'}
          </p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="sm:max-w-[600px]">
          {previewItem && (
            <>
              <DialogHeader>
                <DialogTitle className="truncate">{previewItem.filename}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {isImage(previewItem.mimeType) ? (
                  <div className="rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center max-h-80">
                    <img src={previewItem.url} alt={previewItem.alt || previewItem.filename} className="max-h-80 object-contain" />
                  </div>
                ) : (
                  <div className="rounded-lg bg-gray-50 flex items-center justify-center h-48">
                    <File className="size-16 text-gray-300" />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Тип файла</p>
                    <p className="font-medium text-gray-900">{previewItem.mimeType}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Размер</p>
                    <p className="font-medium text-gray-900">{formatSize(previewItem.size)}</p>
                  </div>
                  {previewItem.width && previewItem.height && (
                    <div>
                      <p className="text-gray-400 text-xs">Разрешение</p>
                      <p className="font-medium text-gray-900">{previewItem.width} &times; {previewItem.height}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-400 text-xs">Дата загрузки</p>
                    <p className="font-medium text-gray-900">{formatDate(previewItem.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">URL</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs bg-gray-100 rounded px-2 py-1 flex-1 truncate">{previewItem.url}</code>
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-gray-200 text-gray-600 text-xs"
                      onClick={() => navigator.clipboard.writeText(previewItem.url)}
                    >
                      Копировать
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Удалить файл?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Файл будет удалён безвозвратно. Эта операция не может быть отменена.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Отмена</Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={handleDelete} disabled={deleting}>
              {deleting && <Loader2 className="size-4 animate-spin mr-2" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
