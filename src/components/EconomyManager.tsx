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

interface EconomyData {
  team: {
    id: string
    name: string
    transferBudget: number
    wageBudget: number
  }
  finances: {
    softCap: number
    annualWages: number
    weeklyWages: number
    isOverCap: boolean
    overCapAmount: number
    luxuryTax: number
    remainingBudget: number
    projectedBudget: number
  }
  payroll: {
    playerCount: number
    weeklyWages: number
    coachWages: number
    totalWeeklyWages: number
  }
  bailout: {
    available: boolean
    amount: number
    cooldown: number
    usedCount: number
  }
}

export function EconomyManager() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [data, setData] = useState<EconomyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchEconomy()
  }, [session])

  const fetchEconomy = async () => {
    if (!session?.user?.teamId) return

    try {
      const res = await fetch("/api/team/economy")
      const economyData = await res.json()

      if (res.ok) {
        setData(economyData)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Nepavyko įkelti ekonomikos duomenų" })
    } finally {
      setLoading(false)
    }
  }

  const handleBailout = async () => {
    if (!data?.bailout.available) return

    if (!confirm(`Ar tikrai norite paimti ${data.bailout.amount}$ paskolą?\n\nŠi suma bus atimta iš kito sezono biudžeto.`)) {
      return
    }

    setProcessing(true)
    setMessage(null)

    try {
      const res = await fetch("/api/team/economy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "bailout" })
      })

      const result = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: result.message })
        fetchEconomy()
      } else {
        setMessage({ type: "error", text: result.error || "Nepavyko gauti paskolos" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Įvyko klaida" })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!data) return null

  const capPercentage = (data.finances.annualWages / data.finances.softCap) * 100

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
          {message.text}
        </div>
      )}

      {/* Budget Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">Transferų Biudžetas</h3>
          <p className="text-3xl font-bold text-green-400">
            ${data.finances.projectedBudget.toLocaleString()}
          </p>
          {data.finances.luxuryTax > 0 && (
            <p className="text-sm text-red-400 mt-2">
              -${data.finances.luxuryTax.toLocaleString()} Luxury Tax
            </p>
          )}
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">Algas (Metinės)</h3>
          <p className={`text-3xl font-bold ${data.finances.isOverCap ? "text-red-400" : "text-blue-400"}`}>
            ${data.finances.annualWages.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            iš ${data.finances.softCap.toLocaleString()} Soft Cap
          </p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h3 className="text-slate-400 text-sm mb-1">Savaitės Algos</h3>
          <p className="text-3xl font-bold text-white">
            ${data.payroll.totalWeeklyWages.toLocaleString()}
          </p>
          <p className="text-sm text-slate-400 mt-2">
            {data.payroll.playerCount} žaidėjai
          </p>
        </div>
      </div>

      {/* Salary Cap Visualization */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
        <h3 className="text-lg font-semibold mb-4">📊 Salary Cap</h3>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-400">Soft Cap: ${data.finances.softCap.toLocaleString()}</span>
            <span className={`${data.finances.isOverCap ? "text-red-400" : "text-green-400"}`}>
              {capPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${data.finances.isOverCap ? "bg-gradient-to-r from-yellow-500 to-red-500" : "bg-blue-500"}`}
              style={{ width: `${Math.min(capPercentage, 100)}%` }}
            />
          </div>
        </div>

        {data.finances.isOverCap && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-semibold text-red-400">Luxury Tax</h4>
                <p className="text-sm text-slate-300">
                  Viršijote Soft Capą po ${data.finances.overCapAmount.toLocaleString()}.
                  Mokėsite <strong>${data.finances.luxuryTax.toLocaleString()}</strong> taxą!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payroll Breakdown */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-semibold">💰 Algalapis</h3>
        </div>
        <div className="divide-y divide-slate-700">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👕</span>
              <span>Žaidėjų algos</span>
            </div>
            <span className="font-bold">${data.payroll.weeklyWages.toLocaleString()}/sav.</span>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📋</span>
              <span>Trenerių algos</span>
            </div>
            <span className="font-bold">${data.payroll.coachWages.toLocaleString()}/sav.</span>
          </div>
          <div className="p-4 flex items-center justify-between bg-slate-700/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📊</span>
              <span className="font-semibold">Viso per savaitę</span>
            </div>
            <span className="font-bold text-blue-400">${data.payroll.totalWeeklyWages.toLocaleString()}/sav.</span>
          </div>
        </div>
      </div>

      {/* Bailout Loan */}
      <div className={`rounded-xl border p-6 ${data.bailout.available ? "bg-yellow-500/10 border-yellow-500/30" : "bg-slate-800 border-slate-700"}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🏦</span>
            <div>
              <h4 className="font-semibold text-yellow-400">Bailout Paskola</h4>
              <p className="text-sm text-slate-400 mt-1">
                {data.bailout.available
                  ? `Gaukite ${data.bailout.amount}$ paskolą. Galima naudoti kartą per ${data.bailout.cooldown} sezonus.`
                  : "Jau naudojote šį sezono bailout. Išbandykite kitą sezoną."}
              </p>
              {data.bailout.usedCount > 0 && (
                <p className="text-xs text-slate-500 mt-1">
                  Naudota: {data.bailout.usedCount} kartą (-ą)
                </p>
              )}
            </div>
          </div>
          {data.bailout.available && (
            <button
              onClick={handleBailout}
              disabled={processing}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-slate-600 rounded-lg font-medium transition"
            >
              {processing ? "Apdorojama..." : "Pasiimti Paskolą"}
            </button>
          )}
        </div>
      </div>

      {/* Budget Warning */}
      {data.finances.projectedBudget < 50000 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🚨</span>
            <div>
              <h4 className="font-semibold text-red-400">Biudžeto Įspėjimas</h4>
              <p className="text-sm text-slate-300">
                Jūsų biudžetas artėja prie nulio. Svarbiau stebėkite išlaidas!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
