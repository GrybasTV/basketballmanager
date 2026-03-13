"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface ExtendedUser {
  id: string
  username: string
  email: string
  teamId?: string
}

interface ExtendedSession {
  user?: ExtendedUser
}

interface Notification {
  id: string
  type: string
  content: string
  isRead: boolean
  icon: string
  color: string
  priority: string
  createdAt: string
}

export function NotificationsPanel() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    fetchNotifications()
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [session])

  const fetchNotifications = async () => {
    if (!session?.user) return

    try {
      const res = await fetch("/api/notifications?limit=10")
      const data = await res.json()

      if (res.ok) {
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error("Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId?: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationIds: notificationId ? [notificationId] : undefined,
          markAll: !notificationId
        })
      })

      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark as read")
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications?id=${notificationId}`, { method: "DELETE" })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to delete")
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return "Just now"
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-slate-700 transition"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-slate-800 rounded-xl border border-slate-700 shadow-xl z-20">
            {/* Header */}
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold">Pranešimai</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAsRead()}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    Pažymėti visus
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center text-slate-400">Įkeliama...</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-4xl mb-2">📭</p>
                  <p>Nėra pranešimų</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 transition ${
                      !notif.isRead ? "bg-slate-700/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{notif.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.isRead ? "font-medium" : ""}`}>
                          {notif.content}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{formatTime(notif.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {!notif.isRead && (
                          <button
                            onClick={() => markAsRead(notif.id)}
                            className="p-1 text-slate-400 hover:text-white"
                            title="Pažymėti skaitytu"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notif.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                          title="Ištrinti"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-700 text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm text-slate-400 hover:text-white"
              >
                Uždaryti
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
