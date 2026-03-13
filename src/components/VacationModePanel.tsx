"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

const AI_TAKEOVER_DAYS = 14

interface ExtendedUser {
  id: string
  username: string
  email: string
  teamId?: string
}

interface ExtendedSession {
  user?: ExtendedUser
}

interface Warning {
  type: string
  message: string
  severity: "low" | "medium" | "high"
}

interface ActivityData {
  user: {
    id: string
    username: string
    lastLoginAt: string
    daysSinceLogin: number
  }
  vacation: {
    isInVacation: boolean
    endDate: string | null
    daysRemaining: number
    maxDays: number
  }
  aiTakeover: {
    isTriggered: boolean
    teamControlled: boolean
    daysUntilTakeover: number
  }
  team: {
    id: string
    name: string
    isAiControlled: boolean
    playerCount: number
  } | null
  warnings: Warning[]
}

export function VacationModePanel() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [data, setData] = useState<ActivityData | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [showVacationModal, setShowVacationModal] = useState(false)
  const [vacationDays, setVacationDays] = useState(7)

  useEffect(() => {
    checkActivity()
  }, [session])

  const checkActivity = async () => {
    if (!session?.user) return

    try {
      const res = await fetch("/api/user/activity")
      const activityData = await res.json() as any

      if (res.ok) {
        setData(activityData)
      }
    } catch (error) {
      console.error("Failed to check activity")
    } finally {
      setLoading(false)
    }
  }

  const startVacation = async () => {
    setActionLoading(true)

    try {
      const res = await fetch("/api/user/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "start_vacation", days: vacationDays })
      })

      const result = await res.json() as any

      if (res.ok) {
        setShowVacationModal(false)
        checkActivity()
        alert(result.message)
      } else {
        alert(result.error || "Nepavyko")
      }
    } catch (error) {
      alert("Įvyko klaida")
    } finally {
      setActionLoading(false)
    }
  }

  const endVacation = async () => {
    if (!confirm("Ar tikrai baigti atostojas? AI nustos valdyti komandą.")) return

    setActionLoading(true)

    try {
      const res = await fetch("/api/user/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end_vacation" })
      })

      const result = await res.json() as any

      if (res.ok) {
        checkActivity()
        alert(result.message)
      } else {
        alert(result.error || "Nepavyko")
      }
    } catch (error) {
      alert("Įvyko klaida")
    } finally {
      setActionLoading(false)
    }
  }

  const extendVacation = async () => {
    setActionLoading(true)

    try {
      const res = await fetch("/api/user/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "extend_vacation", days: 7 })
      })

      const result = await res.json() as any

      if (res.ok) {
        checkActivity()
        alert(result.message)
      } else {
        alert(result.error || "Nepavyko")
      }
    } catch (error) {
      alert("Įvyko klaida")
    } finally {
      setActionLoading(false)
    }
  }

  const returnFromInactivity = async () => {
    if (!confirm("Ar tikrai norite susigrąžinti komandą?")) return

    setActionLoading(true)

    try {
      const res = await fetch("/api/user/activity", { method: "DELETE" })
      const result = await res.json() as any

      if (res.ok) {
        checkActivity()
        alert(result.message)
      } else {
        alert(result.error || "Nepavyko")
      }
    } catch (error) {
      alert("Įvyko klaida")
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return null

  if (!data) return null

  const { vacation, aiTakeover, warnings } = data

  return (
    <>
      {/* Vacation Mode Banner */}
      {vacation.isInVacation && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏖️</span>
              <div>
                <h4 className="font-semibold text-blue-400">Atostojų Režimas</h4>
                <p className="text-sm text-slate-300">
                  Liko {vacation.daysRemaining} dienų. AI valdo jūsų komandą.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={extendVacation}
                disabled={actionLoading}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded text-sm"
              >
                Pratęsti
              </button>
              <button
                onClick={endVacation}
                disabled={actionLoading}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm"
              >
                Baigti
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Takeover Warning */}
      {aiTakeover.isTriggered && !vacation.isInVacation && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h4 className="font-semibold text-red-400">AI Perėmė Komandą</h4>
                <p className="text-sm text-slate-300">
                  Neaktyvumas viršijanęs {AI_TAKEOVER_DAYS} dienų. Susigrąžinkite komandą!
                </p>
              </div>
            </div>
            <button
              onClick={returnFromInactivity}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 rounded text-sm font-medium"
            >
              Susigrąžinti
            </button>
          </div>
        </div>
      )}

      {/* Inactivity Warning */}
      {!vacation.isInVacation && !aiTakeover.isTriggered && aiTakeover.daysUntilTakeover <= 7 && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-yellow-400">Neaktyvumo Įspėjimas</h4>
                <p className="text-sm text-slate-300">
                  Neprisijungę jau {data.user.daysSinceLogin} dienų.
                  Po {aiTakeover.daysUntilTakeover} dienų AI perims komandą.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowVacationModal(true)}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-sm font-medium"
            >
              Eiti į atostogas
            </button>
          </div>
        </div>
      )}

      {/* Other Warnings */}
      {warnings.map((warning, idx) => (
        <div
          key={idx}
          className={`rounded-xl p-4 mb-4 border ${
            warning.severity === "high"
              ? "bg-red-500/20 border-red-500/30"
              : "bg-yellow-500/20 border-yellow-500/30"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {warning.type === "ROSTER" ? "👕" : "⚠️"}
            </span>
            <p className="text-sm text-slate-300">{warning.message}</p>
          </div>
        </div>
      ))}

      {/* Vacation Modal */}
      {showVacationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">🏖️ Atostojų Režimas</h3>

            <p className="text-slate-300 mb-4">
              Pasirinkite atostojų trukmę. AI perims komandos valdymą šiuo laikotarpiu.
              Maksimalus trukmė - {vacation.maxDays} dienų.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Dienų skaičius: {vacationDays}</label>
                <input
                  type="range"
                  min="1"
                  max={vacation.maxDays}
                  value={vacationDays}
                  onChange={(e) => setVacationDays(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>1</span>
                  <span>{vacation.maxDays}</span>
                </div>
              </div>

              <div className="bg-slate-700/50 rounded-lg p-4 text-sm">
                <p className="text-slate-400">
                  <strong>Atostogų metu:</strong>
                </p>
                <ul className="list-disc list-inside text-slate-400 mt-2 space-y-1">
                  <li>AI valdys sudėtį ir taktiką</li>
                  <li>AI priims sprendimus apie transferus</li>
                  <li>Komanda dalyvaus rungtynėse</li>
                  <li>Galite bet kada sugrįžti</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowVacationModal(false)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Atšaukti
              </button>
              <button
                onClick={startVacation}
                disabled={actionLoading}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium"
              >
                {actionLoading ? "Aktyvuojama..." : "Pradėti Atostogas"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
