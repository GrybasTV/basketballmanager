export const runtime = 'edge';
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NotificationsPanel } from "@/components/NotificationsPanel"
import { VacationModePanel } from "@/components/VacationModePanel"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/login")
  }

  // Fetch user's team
  const userWithTeam = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      team: {
        include: {
          localLeague: true,
          country: true,
          players: {
            take: 5,
            orderBy: { ovr: "desc" }
          }
        }
      }
    }
  })

  if (!userWithTeam?.team) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Sveiki, {session.user.username}!</h1>
          <p className="text-slate-400">Jūs neturite priskirtos komandos. Susisiekite su administratoriumi.</p>
        </div>
      </div>
    )
  }

  const { team } = userWithTeam

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">🏀 Basketball Manager</h1>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">{team.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <NotificationsPanel />
            <span className="text-slate-400">{session.user.username}</span>
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition"
              >
                Atsijungti
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Vacation Mode & Warnings */}
        <VacationModePanel />
        {/* Team Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Komanda</h3>
            <p className="text-2xl font-bold">{team.name}</p>
            <p className="text-slate-400">{team.city}, {team.country.name}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Lyga</h3>
            <p className="text-2xl font-bold">{team.localLeague.name}</p>
            <p className="text-slate-400">Tier {team.localLeague.tier}</p>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-slate-400 text-sm mb-1">Biudžetas</h3>
            <p className="text-2xl font-bold text-green-400">
              ${team.transferBudget.toLocaleString()}
            </p>
            <p className="text-slate-400">Transferų biudžetas</p>
          </div>
        </div>

        {/* Top Players */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-semibold">Geriausi Žaidėjai</h2>
          </div>
          <div className="divide-y divide-slate-700">
            {team.players.map((player) => (
              <div key={player.id} className="p-4 flex items-center justify-between hover:bg-slate-700/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold">
                    {player.position}
                  </div>
                  <div>
                    <p className="font-medium">
                      {player.firstName} {player.lastName}
                    </p>
                    <p className="text-sm text-slate-400">{player.position} • {player.age} m.</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-400">{player.ovr}</p>
                  <p className="text-xs text-slate-500">OVR</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-6 gap-4">
          <a href="/dashboard/team" className="bg-blue-600 hover:bg-blue-700 rounded-xl p-6 border border-blue-500 transition text-center">
            <div className="text-3xl mb-2">👕</div>
            <p className="font-medium">Sudėtis</p>
          </a>
          <a href="/dashboard/training" className="bg-purple-600 hover:bg-purple-700 rounded-xl p-6 border border-purple-500 transition text-center">
            <div className="text-3xl mb-2">🏋️</div>
            <p className="font-medium">Taktika</p>
          </a>
          <a href="/dashboard/transfers" className="bg-orange-600 hover:bg-orange-700 rounded-xl p-6 border border-orange-500 transition text-center">
            <div className="text-3xl mb-2">🤝</div>
            <p className="font-medium">Transferai</p>
          </a>
          <a href="/dashboard/economy" className="bg-green-600 hover:bg-green-700 rounded-xl p-6 border border-green-500 transition text-center">
            <div className="text-3xl mb-2">💰</div>
            <p className="font-medium">Finansai</p>
          </a>
          <a href="/matches" className="bg-slate-800 hover:bg-slate-700 rounded-xl p-6 border border-slate-700 transition text-center">
            <div className="text-3xl mb-2">📅</div>
            <p className="font-medium">Rungtynės</p>
          </a>
          <a href="/halloffame" className="bg-yellow-600 hover:bg-yellow-700 rounded-xl p-6 border border-yellow-500 transition text-center">
            <div className="text-3xl mb-2">🏆</div>
            <p className="font-medium">Šlovės Mazgas</p>
          </a>
        </div>
      </main>
    </div>
  )
}
