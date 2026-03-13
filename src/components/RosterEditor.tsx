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
  ovr: number
  age: number
  height: number
  birthCountry: { code: string; name: string }
}

interface RosterSlot {
  id: string
  position: string
  playerId?: string
}

const POSITIONS: RosterSlot[] = [
  { id: "PG", position: "PG" },
  { id: "SG", position: "SG" },
  { id: "SF", position: "SF" },
  { id: "PF", position: "PF" },
  { id: "C", position: "C" },
  { id: "G", position: "G" },  // 6th man
  { id: "F", position: "F" },  // 7th man
  { id: "C2", position: "C" }, // 8th man
  { id: "PG2", position: "PG" },
  { id: "SG2", position: "SG" },
  { id: "SF2", position: "SF" },
  { id: "PF2", position: "PF" },
]

export function RosterEditor() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [roster, setRoster] = useState<Record<string, string | null>>({})

  useEffect(() => {
    fetchRoster()
  }, [session])

  const fetchRoster = async () => {
    if (!session?.user?.teamId) return

    try {
      const res = await fetch("/api/team/roster")
      const data = await res.json()

      if (res.ok) {
        setPlayers(data.team.players)
        // Initialize roster with first 12 players
        const initialRoster: Record<string, string | null> = {}
        data.team.players.slice(0, 12).forEach((player: Player, idx: number) => {
          initialRoster[POSITIONS[idx].id] = player.id
        })
        setRoster(initialRoster)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Nepavyko įkelti sudėties" })
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (slotId: string, playerId: string) => {
    setRoster(prev => ({
      ...prev,
      [slotId]: playerId
    }))
  }

  const handleRemove = (slotId: string) => {
    setRoster(prev => ({
      ...prev,
      [slotId]: null
    }))
  }

  const getPlayerById = (playerId: string) => players.find(p => p.id === playerId)

  const getAvailablePlayers = () => {
    const assignedIds = Object.values(roster).filter(Boolean) as string[]
    return players.filter(p => !assignedIds.includes(p.id))
  }

  const validateRoster = () => {
    const assignedPlayers = Object.values(roster).filter(Boolean) as string[]

    if (assignedPlayers.length < 10) {
      return { valid: false, error: "Minimalus sudėtis - 10 žaidėjai" }
    }

    // Count local players
    const localPlayers = assignedPlayers
      .map(id => getPlayerById(id))
      .filter(p => p && ["LT", "LV", "EE", "PL"].includes(p.birthCountry.code))

    if (localPlayers.length > 6) {
      return { valid: false, error: `Vietinių žaidėjų limitas: 6/12. Dabartinis: ${localPlayers.length}/12` }
    }

    return { valid: true }
  }

  const handleSave = async () => {
    const validation = validateRoster()
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.error! })
      return
    }

    setSaving(true)
    setMessage(null)

    try {
      const activePlayerIds = Object.entries(roster)
        .filter(([_, playerId]) => playerId !== null)
        .slice(0, 12)
        .map(([_, playerId]) => playerId)

      const res = await fetch("/api/team/roster", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activePlayerIds, benchPlayerIds: [] })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: "success", text: "Sudėtis išsaugota!" })
      } else {
        setMessage({ type: "error", text: data.error || "Nepavyko išsaugoti" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Įvyko klaida" })
    } finally {
      setSaving(false)
    }
  }

  const availablePlayers = getAvailablePlayers()
  const assignedPlayers = Object.values(roster).filter(Boolean) as string[]
  const localPlayerCount = assignedPlayers
    .map(id => getPlayerById(id))
    .filter(p => p && ["LT", "LV", "EE", "PL"].includes(p?.birthCountry.code)).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Bar */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
        <div className="flex gap-6">
          <div>
            <span className="text-slate-400 text-sm">Žaidėjai:</span>
            <span className="ml-2 font-bold">{assignedPlayers.length}/12</span>
          </div>
          <div>
            <span className="text-slate-400 text-sm">Vietiniai:</span>
            <span className={`ml-2 font-bold ${localPlayerCount > 6 ? "text-red-400" : "text-green-400"}`}>
              {localPlayerCount}/6
            </span>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 rounded-lg font-medium transition"
        >
          {saving ? "Saugoma..." : "Išsaugoti"}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${message.type === "success" ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Starting Five + Bench */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">📋 Sudėtis</h3>
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-2 gap-px bg-slate-700">
              {POSITIONS.map((slot, idx) => (
                <div
                  key={slot.id}
                  className="bg-slate-800 p-3 min-h-[80px] relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const playerId = e.dataTransfer.getData("playerId")
                    handleDrop(slot.id, playerId)
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-500">
                      {idx < 5 ? "🏃" : "🪑"} {slot.position}
                    </span>
                    {roster[slot.id] && (
                      <button
                        onClick={() => handleRemove(slot.id)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {roster[slot.id] ? (
                    <div className="bg-slate-700 rounded-lg p-2">
                      <p className="font-medium text-sm text-white truncate">
                        {getPlayerById(roster[slot.id]!)?.firstName}{" "}
                        {getPlayerById(roster[slot.id]!)?.lastName}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-slate-400">
                          {getPlayerById(roster[slot.id]!)?.position} • {getPlayerById(roster[slot.id]!)?.age}m
                        </span>
                        <span className="text-sm font-bold text-yellow-400">
                          {getPlayerById(roster[slot.id]!)?.ovr}
                        </span>
                      </div>
                      {["LT", "LV", "EE", "PL"].includes(getPlayerById(roster[slot.id]!)?.birthCountry.code || "") && (
                        <span className="text-xs text-blue-400">🇱🇹 Vietinis</span>
                      )}
                    </div>
                  ) : (
                    <div className="h-14 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center text-slate-500 text-sm">
                      Tempkite žaidėją
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Available Players */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">
            📦 Atsarginiai ({availablePlayers.length})
          </h3>
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-4 space-y-2 max-h-[600px] overflow-y-auto">
            {availablePlayers.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Visi žaidėjai priskirti</p>
            ) : (
              availablePlayers.map((player) => (
                <div
                  key={player.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("playerId", player.id)}
                  className="bg-slate-700 rounded-lg p-3 cursor-move hover:bg-slate-600 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
                        {player.position}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {player.firstName} {player.lastName}
                        </p>
                        <p className="text-xs text-slate-400">
                          {player.age}m • {player.height}cm • {player.birthCountry.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-yellow-400">{player.ovr}</p>
                      {["LT", "LV", "EE", "PL"].includes(player.birthCountry.code) && (
                        <p className="text-xs text-blue-400">Vietinis</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
