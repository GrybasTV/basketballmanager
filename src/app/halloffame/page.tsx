import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getHallOfFame(category: string = "points") {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/stats/halloffame?category=${category}&limit=50`, {
    cache: "no-store"
  })

  if (!res.ok) return { hallOfFame: [], seasonLeaders: [], categories: [] }
  return res.json()
}

export default async function HallOfFamePage({
  searchParams
}: {
  searchParams: { category?: string }
}) {
  const session = await getServerSession(authOptions)
  const category = searchParams.category || "points"

  const { hallOfFame, seasonLeaders, categories } = await getHallOfFame(category)

  const categoryNames: Record<string, string> = {
    points: "Taškai",
    rebounds: "Atkovojimai",
    assists: "Rezultatyvūs perdavimai",
    steals: "Perimimai",
    blocks: "Blokuotės"
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href={session?.user ? "/dashboard" : "/"} className="text-blue-400 hover:text-blue-300">
              ← Atgal
            </a>
            <h1 className="text-2xl font-bold">🏆 Šlovės Mazgas</h1>
          </div>
          <div className="flex items-center gap-4">
            {session?.user ? (
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
                >
                  Atsijungti
                </button>
              </form>
            ) : (
              <a href="/auth/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition">
                Prisijungti
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat: string) => (
            <a
              key={cat}
              href={`/halloffame?category=${cat}`}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                category === cat
                  ? "bg-blue-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {categoryNames[cat] || cat}
            </a>
          ))}
        </div>

        {/* All-Time Leaders */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">📊 Visų LaikŲ Lyderiai: {categoryNames[category]}</h2>
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-slate-700/50 text-sm font-medium text-slate-400">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Žaidėjas</div>
              <div className="col-span-3">Komanda</div>
              <div className="col-span-2">Šalis</div>
              <div className="col-span-1 text-right">Viso</div>
            </div>
            <div className="divide-y divide-slate-700">
              {hallOfFame.map((entry: any, idx: number) => {
                const value = entry.total[category === "points" ? "points" :
                              category === "rebounds" ? "rebounds" :
                              category === "assists" ? "assists" :
                              category === "steals" ? "steals" : "blocks"] || 0
                const player = entry.player

                return (
                  <div key={player.id} className={`grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-700/30 transition ${idx < 3 ? "bg-yellow-500/5" : ""}`}>
                    <div className="col-span-1">
                      {idx < 3 ? (
                        <span className="text-2xl">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        <span className="text-slate-500">#{idx + 1}</span>
                      )}
                    </div>
                    <div className="col-span-5">
                      <p className="font-medium">{player.firstName} {player.lastName}</p>
                      <p className="text-sm text-slate-400">{player.position} • {player.age}m</p>
                    </div>
                    <div className="col-span-3">
                      <p className="text-slate-300">{player.team?.city} {player.team?.name}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm">{player.birthCountry.code}</span>
                    </div>
                    <div className="col-span-1 text-right">
                      <span className={`font-bold ${idx < 3 ? "text-yellow-400" : "text-blue-400"}`}>
                        {typeof value === "number" ? Math.round(value) : value}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Season Leaders */}
        <div>
          <h2 className="text-2xl font-bold mb-4">🔥 Sezono Lyderiai</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seasonLeaders.slice(0, 6).map((entry: any, idx: number) => (
              <div key={entry.id} className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center gap-4">
                <div className="text-3xl font-bold text-slate-600 w-8">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.player.firstName} {entry.player.lastName}</p>
                  <p className="text-sm text-slate-400">{entry.player.team?.city} {entry.player.team?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-400">{entry.points.toFixed(1)}</p>
                  <p className="text-xs text-slate-500">PPG</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
