'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle,
  XCircle,
  Trash2,
  Search,
  Loader2,
  MessageSquare,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  Reply,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Comment {
  id: string
  content: string
  status: string
  createdAt: string
  updatedAt: string
  parentId: string | null
  authorId: string | null
  newsId: string | null
  author: { id: string; name: string | null; email: string; avatar: string | null } | null
  news: { id: string; title: string; slug: string } | null
  parent: { id: string; content: string } | null
  replies: { id: string }[]
}

interface CommentsResponse {
  comments: Comment[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-700' },
  approved: { label: 'Одобрен', color: 'bg-green-100 text-green-700' },
  rejected: { label: 'Отклонён', color: 'bg-red-100 text-red-700' },
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatShortDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

export default function AdminComments() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const perPage = 15

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Reply state
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyTarget, setReplyTarget] = useState<Comment | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [replySending, setReplySending] = useState(false)

  const loadComments = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', perPage.toString())
      if (tab !== 'all') params.set('status', tab)
      if (search.trim()) params.set('search', search.trim())

      const res = await fetch(`/api/admin/comments?${params.toString()}`)
      if (res.ok) {
        const data: CommentsResponse = await res.json()
        setComments(data.comments)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } finally {
      setLoading(false)
    }
  }, [tab, search, page])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c)),
        )
        setTotal((prev) => {
          if (status === 'approved') return prev
          return prev
        })
      }
    } catch {}
  }

  const handleBulkApprove = async () => {
    const pendingComments = comments.filter((c) => c.status === 'pending')
    if (pendingComments.length === 0) return

    try {
      await Promise.all(
        pendingComments.map((c) =>
          fetch('/api/admin/comments', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: c.id, status: 'approved' }),
          }),
        ),
      )
      await loadComments()
    } catch {}
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget.id }),
      })
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== deleteTarget.id))
        setTotal((prev) => prev - 1)
      }
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
    }
  }

  const openReply = (comment: Comment) => {
    setReplyTarget(comment)
    setReplyContent('')
    setReplyDialogOpen(true)
  }

  const handleReply = async () => {
    if (!replyTarget || !replyContent.trim()) return
    setReplySending(true)
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent.trim(),
          parentId: replyTarget.id,
          newsId: replyTarget.newsId,
          authorId: replyTarget.authorId,
        }),
      })
      if (res.ok) {
        await loadComments()
        setReplyDialogOpen(false)
        setReplyTarget(null)
        setReplyContent('')
      }
    } finally {
      setReplySending(false)
    }
  }

  const pendingCount = comments.filter((c) => c.status === 'pending').length

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="animate-pulse bg-gray-200 rounded-lg h-8 w-64" />
            <div className="animate-pulse bg-gray-200 rounded-lg h-4 w-32" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="animate-pulse bg-gray-200 rounded-lg h-9 w-64" />
          <div className="animate-pulse bg-gray-200 rounded-lg h-9 w-72" />
        </div>
        <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="space-y-2 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-100 rounded-lg h-14" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Модерация комментариев
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {total} комментариев
            {pendingCount > 0 && (
              <span className="ml-2 text-yellow-600 font-medium">
                ({pendingCount} ожидают проверки)
              </span>
            )}
          </p>
        </div>
        {pendingCount > 0 && (
          <Button
            className="bg-green-600 hover:bg-green-700 text-white shrink-0"
            onClick={handleBulkApprove}
          >
            <CheckCheck className="size-4 mr-2" />
            Одобрить все ({pendingCount})
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Поиск по автору или тексту..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="h-9 pl-9 border-gray-200 bg-gray-50 focus-visible:bg-white"
          />
        </div>
        <Tabs value={tab} onValueChange={(v) => { setTab(v); setPage(1) }}>
          <TabsList className="bg-gray-100">
            <TabsTrigger value="all">Все</TabsTrigger>
            <TabsTrigger value="pending">Ожидают</TabsTrigger>
            <TabsTrigger value="approved">Одобренные</TabsTrigger>
            <TabsTrigger value="rejected">Отклонённые</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left px-6 py-3 font-medium text-gray-500">
                Автор
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Комментарий
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Новость
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Статус
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Дата
              </th>
              <th className="text-right px-6 py-3 font-medium text-gray-500">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {comments.map((comment) => {
              const st = statusMap[comment.status] || statusMap.pending
              const isExpanded = expandedId === comment.id
              return (
                <tr key={comment.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {comment.author?.name || comment.author?.email || 'Аноним'}
                      </p>
                      {comment.author?.email && comment.author?.name && (
                        <p className="text-xs text-gray-400">{comment.author.email}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <div className="flex items-start gap-2">
                      {comment.parent && (
                        <MessageSquare className="size-3.5 text-blue-400 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <p
                          className={`text-gray-700 text-sm ${
                            !isExpanded && comment.content.length > 80
                              ? 'line-clamp-2'
                              : ''
                          }`}
                        >
                          {comment.content}
                        </p>
                        {comment.content.length > 80 && (
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : comment.id)}
                            className="text-blue-600 text-xs hover:underline mt-1"
                          >
                            {isExpanded ? (
                              <span className="inline-flex items-center gap-0.5">
                                <ChevronUp className="size-3" /> Свернуть
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-0.5">
                                <ChevronDown className="size-3" /> Читать далее
                              </span>
                            )}
                          </button>
                        )}
                        {comment.replies.length > 0 && (
                          <p className="text-xs text-gray-400 mt-1">
                            {comment.replies.length}{' '}
                            {comment.replies.length === 1
                              ? 'ответ'
                              : comment.replies.length < 5
                                ? 'ответа'
                                : 'ответов'}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 max-w-[180px]">
                    <p className="text-sm text-gray-600 truncate" title={comment.news?.title}>
                      {comment.news?.title || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge
                      variant="secondary"
                      className={`${st.color} text-[11px] px-2 py-0`}
                    >
                      {st.label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-sm whitespace-nowrap">
                    {formatShortDate(comment.createdAt)}
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {comment.status !== 'approved' && (
                        <button
                          onClick={() => handleStatusChange(comment.id, 'approved')}
                          className="rounded-md p-2 text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors"
                          aria-label="Одобрить"
                          title="Одобрить"
                        >
                          <CheckCircle className="size-4" />
                        </button>
                      )}
                      {comment.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(comment.id, 'rejected')}
                          className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          aria-label="Отклонить"
                          title="Отклонить"
                        >
                          <XCircle className="size-4" />
                        </button>
                      )}
                      <button
                        onClick={() => openReply(comment)}
                        className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        aria-label="Ответить"
                        title="Ответить"
                      >
                        <Reply className="size-4" />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteTarget(comment)
                          setDeleteDialogOpen(true)
                        }}
                        className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        aria-label="Удалить"
                        title="Удалить"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {comments.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                  <MessageSquare className="size-10 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Комментарии не найдены</p>
                  <p className="text-sm mt-1">
                    {search
                      ? 'Попробуйте изменить параметры поиска'
                      : 'В базе пока нет комментариев'}
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {comments.map((comment) => {
          const st = statusMap[comment.status] || statusMap.pending
          const isExpanded = expandedId === comment.id
          return (
            <div
              key={comment.id}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {comment.author?.name || comment.author?.email || 'Аноним'}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`${st.color} text-[10px] px-1.5 py-0`}
                    >
                      {st.label}
                    </Badge>
                  </div>

                  {/* Comment content */}
                  <div className="mt-2">
                    <p
                      className={`text-sm text-gray-700 leading-relaxed ${
                        !isExpanded && comment.content.length > 100
                          ? 'line-clamp-2'
                          : ''
                      }`}
                    >
                      {comment.content}
                    </p>
                    {comment.content.length > 100 && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : comment.id)}
                        className="text-blue-600 text-xs hover:underline mt-1"
                      >
                        {isExpanded ? (
                          <span className="inline-flex items-center gap-0.5">
                            <ChevronUp className="size-3" /> Свернуть
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5">
                            <ChevronDown className="size-3" /> Читать далее
                          </span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {comment.news && (
                      <span className="text-xs text-gray-400 truncate max-w-[180px]">
                        {comment.news.title}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formatShortDate(comment.createdAt)}
                    </span>
                    {comment.replies.length > 0 && (
                      <span className="text-xs text-blue-500">
                        {comment.replies.length} ответ.
                      </span>
                    )}
                    {comment.parent && (
                      <span className="text-xs text-gray-400 inline-flex items-center gap-0.5">
                        <MessageSquare className="size-3" /> Ответ
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => handleStatusChange(comment.id, 'approved')}
                      className="rounded-md p-2 text-gray-400 hover:bg-green-50 hover:text-green-600"
                    >
                      <CheckCircle className="size-4" />
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => handleStatusChange(comment.id, 'rejected')}
                      className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <XCircle className="size-4" />
                    </button>
                  )}
                  <button
                    onClick={() => openReply(comment)}
                    className="rounded-md p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Reply className="size-4" />
                  </button>
                  <button
                    onClick={() => {
                      setDeleteTarget(comment)
                      setDeleteDialogOpen(true)
                    }}
                    className="rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {comments.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center text-gray-400">
            <MessageSquare className="size-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Комментарии не найдены</p>
            <p className="text-sm mt-1">
              {search
                ? 'Попробуйте изменить параметры поиска'
                : 'В базе пока нет комментариев'}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Страница {page} из {totalPages} ({total} всего)
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="border-gray-200 text-gray-600"
            >
              Назад
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (totalPages <= 5) return true
                if (p === 1 || p === totalPages) return true
                return Math.abs(p - page) <= 1
              })
              .map((p, idx, arr) => (
                <span key={p} className="flex items-center">
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="px-1 text-gray-400">...</span>
                  )}
                  <Button
                    key={p}
                    variant={p === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(p)}
                    className={
                      p === page
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'border-gray-200 text-gray-600'
                    }
                  >
                    {p}
                  </Button>
                </span>
              ))}
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="border-gray-200 text-gray-600"
            >
              Вперёд
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Удалить комментарий?</DialogTitle>
            <DialogDescription>
              Это действие нельзя отменить. Комментарий будет удалён навсегда.
              {deleteTarget && deleteTarget.replies.length > 0 && (
                <span className="block mt-2 text-red-500">
                  Также будет удалено {deleteTarget.replies.length}{' '}
                  {deleteTarget.replies.length === 1
                    ? 'ответ'
                    : deleteTarget.replies.length < 5
                      ? 'ответа'
                      : 'ответов'}{' '}
                  на этот комментарий.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 max-h-24 overflow-y-auto">
              {deleteTarget.content}
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="size-4 animate-spin mr-2" />}
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="size-5 text-blue-600" />
              Ответить на комментарий
            </DialogTitle>
            <DialogDescription>
              {replyTarget && (
                <>
                  Ответ для: <span className="font-medium text-gray-700">{replyTarget.author?.name || replyTarget.author?.email || 'Аноним'}</span>
                  {replyTarget.news && (
                    <span className="block mt-1 text-xs text-gray-400">
                      К новости: {replyTarget.news.title}
                    </span>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          {replyTarget && (
            <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600 max-h-20 overflow-y-auto border-l-2 border-blue-300">
              {replyTarget.content}
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="reply-content" className="text-sm font-medium text-gray-700">
              Ваш ответ
            </label>
            <Textarea
              id="reply-content"
              placeholder="Введите текст ответа..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={4}
              className="border-gray-200 focus-visible:border-blue-500"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setReplyDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleReply}
              disabled={!replyContent.trim() || replySending}
            >
              {replySending && <Loader2 className="size-4 animate-spin mr-2" />}
              Отправить ответ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
