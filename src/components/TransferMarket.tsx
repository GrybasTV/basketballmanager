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

interface Player {
  id: string
  firstName: string
  lastName: string
  position: string
  age: number
  ovr: number
  pot: number
  estimatedValue: number
  currentWage: number
  contractExpires: number | null
  team: { id: string; name: string; city: string }
  birthCountry: { code: string; name: string }
}

interface Offer {
  id: string
  playerId: string
  wageOffered: number
  roleOffered: string
  status: string
  player?: Player
  agent?: { name: string; greed: number }
}

interface TransferData {
  team: {
    id: string
    name: string
    transferBudget: number
    rosterCount: number
    availableSlots: number
    canOffer: boolean
  }
  marketPlayers: Player[]
  activeOffers: Offer[]
  limits: {
    maxRosterSize: number
    maxOffers: number
  }
}

const ROLES = [
  { id: "STAR", name: "Žvaigždė", wageMultiplier: 1.5 },
  { id: "STARTER", name: "Startinis", wageMultiplier: 1.2 },
  { id: "BENCH", name: "Atsarginis", wageMultiplier: 1.0 },
  { id: "PROSPECT", name: "Perspektyvas", wageMultiplier: 0.8 },
]

export function TransferMarket() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [data, setData] = useState<TransferData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "PG" | "SG" | "SF" | "PF" | "C">("all")

  // Offer form state
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)
  const [wageOffer, setWageOffer] = useState(0)
  const [roleOffer, setRoleOffer] = useState("BENCH")
  const [minutesOffer, setMinutesOffer] = useState(20)
  const [makingOffer, setMakingOffer] = useState(false)

  useEffect(() => {
    fetchMarket()
  }, [session])

  const fetchMarket = async () => {
    if (!session?.user?.teamId) return

    try {
      const res = await fetch("/api/transfers")
      const marketData = await res.json()

      if (res.ok) {
        setData(marketData)
      }
    } catch (error) {
      console.error("Failed to fetch market")
    } finally {
      setLoading(false)
    }
  }

  const makeOffer = async () => {
    if (!selectedPlayer) return

    setMakingOffer(true)

    try {
      const res = await fetch("/api/transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: selectedPlayer.id,
          wageOffered: wageOffer,
          roleOffered: roleOffer,
          minutesOffered: minutesOffer,
          offerCategory: "CURRENT_SEASON"
        })
      })

      const result = await res.json()

      if (res.ok) {
        alert(result.message)
        setSelectedPlayer(null)
        fetchMarket()
      } else {
        alert(result.error || "Nepavyko siųsti pasiūlymo")
      }
    } catch (error) {
      alert("Įvyko klaida")
    } finally {
      setMakingOffer(false)
    }
  }

  const withdrawOffer = async (offerId: string) => {
    try {
      const res = await fetch(`/api/transfers?id=${offerId}`, { method: "DELETE" })
      if (res.ok) {
        fetchMarket()
      }
    } catch (error) {
      console.error("Failed to withdraw")
    }
  }

  const acceptOffer = async (offerId: string) => {
    try {
      const res = await fetch("/api/transfers/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId })
      })

      const result = await res.json()

      if (res.ok) {
        alert(result.message)
        fetchMarket()
      } else {
        alert(result.error || "Nepavyko priimti pasiūlymo")
      }
    } catch (error) {
      alert("Įvyko klaida")
    }
  }

  const openOfferModal = (player: Player) => {
    const suggestedWage = Math.round(player.currentWage * 1.2)
    setSelectedPlayer(player)
    setWageOffer(suggestedWage)
    setRoleOffer("BENCH")
    setMinutesOffer(20)
  }

  const filteredPlayers = data?.marketPlayers.filter(p =>
    filter === "all" || p.position === filter
  ) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <span className="text-slate-400 text-sm">Biudžetas</span>
            <p className="text-xl font-bold text-green-400">${data.team.transferBudget.toLocaleString()}</p>
          </div>
          <div>
            <span className="text-slate-400 text-sm">Sudėtis</span>
            <p className="text-xl font-bold">
              {data.team.rosterCount}/{data.limits.maxRosterSize}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-sm">Aktyvūs pasiūlymai</span>
            <p className="text-xl font-bold">
              {data.activeOffers.length}/{data.limits.maxOffers}
            </p>
          </div>
          <div>
            <span className="text-slate-400 text-sm">Laisvi slotai</span>
            <p className={`text-xl font-bold ${data.team.availableSlots > 0 ? "text-green-400" : "text-red-400"}`}>
              {data.team.availableSlots}
            </p>
          </div>
        </div>
      </div>

      {/* Active Offers */}
      {data.activeOffers.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-semibold">📨 Aktyvūs Pasiūlymai</h3>
          </div>
          <div className="divide-y divide-slate-700">
            {data.activeOffers.map((offer) => {
              const player = data.marketPlayers.find(p => p.id === offer.playerId)
              if (!player) return null

              return (
                <div key={offer.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {player.position}
                    </div>
                    <div>
                      <p className="font-medium">{player.firstName} {player.lastName}</p>
                      <p className="text-sm text-slate-400">
                        ${offer.wageOffered}/sav. • {offer.roleOffered}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      offer.status === "ACCEPTED" ? "bg-green-500/20 text-green-400" :
                      offer.status === "REJECTED" ? "bg-red-500/20 text-red-400" :
                      "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {offer.status === "ACCEPTED" ? "Priimta" :
                       offer.status === "REJECTED" ? "Atmesta" : "Laukiama"}
                    </span>
                    {offer.status === "ACCEPTED" && (
                      <button
                        onClick={() => acceptOffer(offer.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                      >
                        Pasirašyti
                      </button>
                    )}
                    {offer.status === "PENDING" && (
                      <button
                        onClick={() => withdrawOffer(offer.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Atšaukti
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Position Filter */}
      <div className="flex gap-2 flex-wrap">
        {["all", "PG", "SG", "SF", "PF", "C"].map((pos) => (
          <button
            key={pos}
            onClick={() => setFilter(pos as any)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === pos
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {pos === "all" ? "Visi" : pos}
          </button>
        ))}
      </div>

      {/* Transfer Market */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h3 className="font-semibold">🛒 Transferų Rinka</h3>
        </div>
        <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
          {filteredPlayers.map((player) => (
            <div key={player.id} className="p-4 hover:bg-slate-700/30 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center font-bold">
                    {player.position}
                  </div>
                  <div>
                    <p className="font-medium">{player.firstName} {player.lastName}</p>
                    <p className="text-sm text-slate-400">
                      {player.team.city} {player.team.name} • {player.age}m • {player.birthCountry.code}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-400">{player.ovr}</p>
                  <p className="text-xs text-slate-500">OVR</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-4 text-sm text-slate-400">
                  <span>Vertė: ${player.estimatedValue.toLocaleString()}</span>
                  <span>Alga: ${player.currentWage}/sav.</span>
                  {player.pot > player.ovr && (
                    <span className="text-green-400">POT: {player.pot}</span>
                  )}
                </div>
                <button
                  onClick={() => openOfferModal(player)}
                  disabled={!data.team.canOffer}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded text-sm"
                >
                  Siūlyti
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 border border-slate-700">
            <h3 className="text-xl font-bold mb-4">Siūlyti Sutartį</h3>

            <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
              <p className="font-medium">{selectedPlayer.firstName} {selectedPlayer.lastName}</p>
              <p className="text-sm text-slate-400">
                {selectedPlayer.position} • {selectedPlayer.ovr} OVR • {selectedPlayer.age}m
              </p>
              <p className="text-sm text-slate-400 mt-2">
                Dabartinė alga: ${selectedPlayer.currentWage}/sav.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Savaitinė Alga ($)</label>
                <input
                  type="number"
                  value={wageOffer}
                  onChange={(e) => setWageOffer(parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white"
                />
                <div className="flex gap-2 mt-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => {
                        setRoleOffer(role.id)
                        setWageOffer(Math.round(selectedPlayer.currentWage * role.wageMultiplier))
                      }}
                      className={`px-3 py-1 rounded text-xs ${
                        roleOffer === role.id
                          ? "bg-blue-600 text-white"
                          : "bg-slate-700 text-slate-300"
                      }`}
                    >
                      {role.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">Rolė</label>
                <select
                  value={roleOffer}
                  onChange={(e) => setRoleOffer(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700 rounded-lg border border-slate-600 text-white"
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">
                  Garantuotos minutes: {minutesOffer}
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  value={minutesOffer}
                  onChange={(e) => setMinutesOffer(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setSelectedPlayer(null)}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Atšaukti
              </button>
              <button
                onClick={makeOffer}
                disabled={makingOffer || wageOffer <= 0}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium"
              >
                {makingOffer ? "Siunčiama..." : "Siųsti Pasiūlymą"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
