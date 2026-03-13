"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Team {
  id: string
  name: string
  city: string
  prestige: number
  localLeague: { name: string; tier: number }
  country: { name: string; code: string }
  _count: { players: number }
}

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Step 1: User info
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Step 2: Team selection
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isLoadingTeams, setIsLoadingTeams] = useState(true)

  useEffect(() => {
    // Fetch available teams
    fetch("/api/auth/register")
      .then((res) => res.json())
      .then((data) => {
        setTeams(data)
        setIsLoadingTeams(false)
      })
      .catch(() => {
        setError("Nepavyko įkelti komandų sąrašo")
        setIsLoadingTeams(false)
      })
  }, [])

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Slaptažodžiai nesutampa")
      return
    }

    if (password.length < 6) {
      setError("Slaptažodis turi turėti bent 6 simbolius")
      return
    }

    setStep(2)
  }

  const handleRegister = async () => {
    if (!selectedTeam) {
      setError("Pasirinkite komandą")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          teamId: selectedTeam.id,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Registracija nepavyko")
        setIsLoading(false)
        return
      }

      // Auto login after registration
      const loginRes = await fetch("/api/auth/callback/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          redirect: false,
        }),
      })

      if (loginRes.ok) {
        router.push("/dashboard")
        router.refresh()
      } else {
        router.push("/auth/login")
      }
    } catch (err) {
      setError("Įvyko klaida. Bandykite dar kartą.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🏀 Basketball Manager</h1>
          <p className="text-slate-400">Pradėk savo kelionę</p>
        </div>

        {/* Register Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-8 shadow-xl">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className={`flex items-center ${step >= 1 ? "text-blue-400" : "text-slate-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 1 ? "bg-blue-500 text-white" : "bg-slate-700"}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Vartotojas</span>
            </div>
            <div className={`w-16 h-1 mx-2 ${step >= 2 ? "bg-blue-500" : "bg-slate-700"}`} />
            <div className={`flex items-center ${step >= 2 ? "text-blue-400" : "text-slate-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${step >= 2 ? "bg-blue-500 text-white" : "bg-slate-700"}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Komanda</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {step === 1 ? (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">Sukurti paskyrą</h2>
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                    Vartotojo vardas
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Minimaliai 3 simboliai"
                    minLength={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    El. paštas
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="pvz@pastas.lt"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    Slaptažodis
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Minimaliai 6 simboliai"
                    minLength={6}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                    Pakartoti slaptažodį
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Pakartokite slaptažodį"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
                >
                  Tęsti →
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-slate-400">
                  Jau turi paskyrą?{" "}
                  <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                    Prisijungti
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold text-white mb-6">Pasirinkite komandą</h2>

              {isLoadingTeams ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-80 overflow-y-auto">
                    {teams.map((team) => (
                      <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        className={`p-4 rounded-lg border-2 text-left transition ${
                          selectedTeam?.id === team.id
                            ? "border-blue-500 bg-blue-500/20"
                            : "border-slate-600 bg-slate-900/50 hover:border-slate-500"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{team.name}</h3>
                            <p className="text-sm text-slate-400">{team.city}, {team.country.name}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                              {team.localLeague.name}
                            </span>
                            <span className="text-xs text-slate-500 mt-1">
                              {team._count.players} žaidėjai
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Prestižas:</span>
                            <div className="flex-1 bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-yellow-500 h-2 rounded-full"
                                style={{ width: `${team.prestige}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-300">{team.prestige}</span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition duration-200"
                    >
                      ← Atgal
                    </button>
                    <button
                      onClick={handleRegister}
                      disabled={!selectedTeam || isLoading}
                      className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Registruojama..." : "Registruotis"}
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
