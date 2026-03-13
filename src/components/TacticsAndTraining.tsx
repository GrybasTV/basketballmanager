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
}

interface TrainingPlan {
  playerId: string
  focus: string
  intensity: number
}

interface Tactics {
  offense: string
  defense: string
  pace: string
  rotationDepth: number
}

const OFFENSE_STYLES = [
  { id: "BALANCED", name: "Balansas", icon: "⚖️", desc: "Lygus puolimo pasiskirstymas" },
  { id: "INSIDE_OUT", name: "Vidurys → Išorė", icon: "🎯", desc: "Žaidimas per vidurį" },
  { id: "PERIMETER", name: "Perimetras", icon: "🏀", desc: "Tritaškių fokusas" },
  { id: "FAST_BREAK", name: "Greitas Ataka", icon: "⚡", desc: "Kontratakavimas" },
]

const DEFENSE_STYLES = [
  { id: "MAN_TO_MAN", name: "Asmeninė", icon: "👤", desc: "Asmeninė gynyba" },
  { id: "ZONE_2_3", name: "2-3 Zona", icon: "🔒", desc: "2-3 zoninė gynyba" },
  { id: "ZONE_3_2", name: "3-2 Zona", icon: "🛡️", desc: "3-2 zoninė gynyba" },
  { id: "PRESS", name: "Presingas", icon: "🔥", desc: "Aukštas presingas" },
]

const PACE_OPTIONS = [
  { id: "SLOW", name: "Lėtas", icon: "🐢" },
  { id: "MODERATE", name: "Vidutinis", icon: "🚶" },
  { id: "FAST", name: "Greitas", icon: "🏃" },
]

const TRAINING_FOCI = [
  { id: "SHOOTING", name: "Metai", icon: "🏀", color: "bg-orange-500" },
  { id: "DEFENSE", name: "Gynyba", icon: "🛡️", color: "bg-blue-500" },
  { id: "PLAYMAKING", name: "Perdavimai", icon: "📡", color: "bg-purple-500" },
  { id: "REBOUNDING", name: "Atkovojimas", icon: "📊", color: "bg-green-500" },
  { id: "PHYSICAL", name: "Fizinis", icon: "💪", color: "bg-red-500" },
  { id: "BALANCED", name: "Balansas", icon: "⚖️", color: "bg-gray-500" },
]

export function TacticsAndTraining() {
  const { data: session } = useSession() as { data: ExtendedSession | null }
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const [players, setPlayers] = useState<Player[]>([])
  const [tactics, setTactics] = useState<Tactics>({
    offense: "BALANCED",
    defense: "MAN_TO_MAN",
    pace: "MODERATE",
    rotationDepth: 8
  })
  const [trainingPlans, setTrainingPlans] = useState<Record<string, TrainingPlan>>({})

  useEffect(() => {
    fetchData()
  }, [session])

  const fetchData = async () => {
    if (!session?.user?.teamId) return

    try {
      const res = await fetch("/api/team/training")
      const data = await res.json() as any

      if (res.ok) {
        setPlayers(data.team.players)
        setTactics(data.tactics)

        const plans: Record<string, TrainingPlan> = {}
        data.trainingPlans.forEach((plan: TrainingPlan) => {
          plans[plan.playerId] = plan
        })
        setTrainingPlans(plans)
      }
    } catch (error) {
      setMessage({ type: "error", text: "Nepavyko įkelti duomenų" })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const res = await fetch("/api/team/training", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tactics,
          trainingPlans: Object.values(trainingPlans)
        })
      })

      if (res.ok) {
        setMessage({ type: "success", text: "Taktikos ir treniruotės išsaugotos!" })
      } else {
        setMessage({ type: "error", text: "Nepavyko išsaugoti" })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Įvyko klaida" })
    } finally {
      setSaving(false)
    }
  }

  const updateTrainingPlan = (playerId: string, updates: Partial<TrainingPlan>) => {
    setTrainingPlans(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        playerId,
        ...updates
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Save Button */}
      <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
        <h3 className="text-lg font-semibold">⚙️ Komandinės Taktikos</h3>
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

      {/* Tactics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Offense */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h4 className="font-semibold text-white">🏀 Puolimo Stilius</h4>
          </div>
          <div className="p-4 space-y-2">
            {OFFENSE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setTactics(prev => ({ ...prev, offense: style.id }))}
                className={`w-full p-3 rounded-lg text-left transition ${
                  tactics.offense === style.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <p className="font-medium">{style.name}</p>
                    <p className={`text-xs ${tactics.offense === style.id ? "text-blue-100" : "text-slate-400"}`}>
                      {style.desc}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Defense */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h4 className="font-semibold text-white">🛡️ Gynybos Stilius</h4>
          </div>
          <div className="p-4 space-y-2">
            {DEFENSE_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => setTactics(prev => ({ ...prev, defense: style.id }))}
                className={`w-full p-3 rounded-lg text-left transition ${
                  tactics.defense === style.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <p className="font-medium">{style.name}</p>
                    <p className={`text-xs ${tactics.defense === style.id ? "text-blue-100" : "text-slate-400"}`}>
                      {style.desc}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Pace & Rotation */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h4 className="font-semibold text-white">⚡ Tempas</h4>
          </div>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              {PACE_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setTactics(prev => ({ ...prev, pace: option.id }))}
                  className={`w-full p-3 rounded-lg text-left transition ${
                    tactics.pace === option.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{option.icon}</span>
                    <span className="font-medium">{option.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-700">
              <label className="text-sm text-slate-400 block mb-2">Rotacijos gylis: {tactics.rotationDepth}</label>
              <input
                type="range"
                min="7"
                max="12"
                value={tactics.rotationDepth}
                onChange={(e) => setTactics(prev => ({ ...prev, rotationDepth: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Training Plans */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-700">
          <h4 className="font-semibold text-white">🏋️ Individualios Treniruotės</h4>
          <p className="text-sm text-slate-400">Nustatykite kiekvieno žaidėjo treniruočių fokusą</p>
        </div>
        <div className="divide-y divide-slate-700">
          {players.map((player) => {
            const plan = trainingPlans[player.id] || { playerId: player.id, focus: "BALANCED", intensity: 50 }
            const focusInfo = TRAINING_FOCI.find(f => f.id === plan.focus) || TRAINING_FOCI[5]

            return (
              <div key={player.id} className="p-4 flex items-center gap-4 hover:bg-slate-700/30 transition">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {player.position}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {player.firstName} {player.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{player.age}m • {player.ovr} OVR</p>
                </div>

                <div className="flex items-center gap-2">
                  {TRAINING_FOCI.map((focus) => (
                    <button
                      key={focus.id}
                      onClick={() => updateTrainingPlan(player.id, { focus: focus.id })}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                        plan.focus === focus.id
                          ? `${focus.color} text-white`
                          : "bg-slate-700 text-slate-400 hover:bg-slate-600"
                      }`}
                      title={focus.name}
                    >
                      {focus.icon}
                    </button>
                  ))}
                </div>

                <div className="w-24 flex-shrink-0">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={plan.intensity}
                    onChange={(e) => updateTrainingPlan(player.id, { intensity: parseInt(e.target.value) })}
                    className="w-full"
                    title={`Intensyvumas: ${plan.intensity}%`}
                  />
                  <p className="text-xs text-center text-slate-400 mt-1">{plan.intensity}%</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Emergency Filling Notice */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">👕</span>
          <div>
            <h5 className="font-semibold text-yellow-400">Emergency Filling (Gray Shirts)</h5>
            <p className="text-sm text-slate-400">
              Jei sudėtyje mažiau nei 10 žaidėjų, sistema automatiškai pasamdo laikinus žaidėjus.
              Jie žaidžia minimalų minutų skaičių ir gali būti atleisti bet kuriuo metu.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
