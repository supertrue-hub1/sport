'use client'

import { useState, useEffect } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Clock, Shield } from 'lucide-react'
import './globals-admin.css'
import '@mdxeditor/editor/style.css'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

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
    const interval = setInterval(updateTime, 60000) // update every minute
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="admin-panel min-h-screen flex flex-col">
      {/* Loading Bar */}
      <div className="admin-loading-bar" />

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:pl-64 flex flex-col min-h-screen flex-1">
        <AdminHeader onMenuToggle={() => setSidebarOpen(true)} />

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
