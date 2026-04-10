'use client'

import { useState, useEffect, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Clock, Shield, Loader2 } from 'lucide-react'
import './globals-admin.css'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/auth')
      const data = await res.json()

      if (data.authenticated && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
        if (!isLoginPage) {
          router.push('/admin/login')
        }
      }
    } catch {
      setUser(null)
      if (!isLoginPage) {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }, [isLoginPage, router])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    function updateTime() {
      setCurrentTime(
        new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setUser(null)
    router.push('/admin/login')
  }

  // Login page — render without sidebar
  if (isLoginPage) {
    return <>{children}</>
  }

  // Auth loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-blue-500" />
          <p className="text-sm text-gray-500">Проверка авторизации...</p>
        </div>
      </div>
    )
  }

  // Not authenticated — redirect (handled in checkAuth, but show nothing while redirecting)
  if (!user) {
    return null
  }

  return (
    <div className="admin-panel min-h-screen flex flex-col">
      {/* Loading Bar */}
      <div className="admin-loading-bar" />

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        <AdminHeader
          onMenuToggle={() => setSidebarOpen(true)}
          user={user}
          onLogout={handleLogout}
        />

        {/* Top bar with CMS name + time */}
        <div className="admin-top-bar px-4 lg:px-6 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="size-4 text-blue-500" />
            <span className="text-sm font-semibold text-gray-700">US Sports Hub CMS</span>
            <span className="hidden sm:inline text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Панель управления
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="size-3.5" />
            <span className="font-mono tabular-nums">{currentTime}</span>
          </div>
        </div>

        {/* Main content */}
        <main className="p-4 lg:p-6 flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="admin-footer">
          © 2025 US Sports Hub CMS · v1.0
        </footer>
      </div>
    </div>
  )
}
