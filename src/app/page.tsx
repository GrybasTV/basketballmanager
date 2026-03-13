export const runtime = 'edge';
import Link from 'next/link';
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

async function getLeagueData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leagues`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json() as any;
}

async function getTopPlayers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/players?limit=6&sortBy=ovr&order=desc`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json() as any;
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  // If logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard")
  }

  const leagues = await getLeagueData();
  const topPlayers = await getTopPlayers();
  const league = leagues[0];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">
              🏀 Basketball Manager
            </h1>
            <nav className="flex gap-4">
              <Link href="/teams" className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition">
                Komandos
              </Link>
              <Link href="/standings" className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition">
                Lentelė
              </Link>
              <Link href="/matches" className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition">
                Rungtynės
              </Link>
              <div className="w-px bg-slate-600" />
              <Link href="/auth/login" className="rounded-lg px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition">
                Prisijungti
              </Link>
              <Link href="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
                Registruotis
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-2xl">
          <h2 className="text-4xl font-bold">
            {league?.name || 'Lietuvos Krepšinio Lyga'}
          </h2>
          <p className="mt-2 text-blue-100">
            Anime/Manga stiliaus krepšinio menedžeris
          </p>
          {league && (
            <div className="mt-6 flex gap-6">
              <div>
                <div className="text-3xl font-bold">{league._count?.teams || 12}</div>
                <div className="text-sm text-blue-200">Komandos</div>
              </div>
              <div>
                <div className="text-3xl font-bold">{league._count?.matches || 132}</div>
                <div className="text-sm text-blue-200">Rungtynės</div>
              </div>
              <div>
                <div className="text-3xl font-bold">180</div>
                <div className="text-sm text-blue-200">Žaidėjai</div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Top Players with Avatars */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h3 className="mb-6 text-xl font-semibold text-white">🌟 Top Žaidėjai</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topPlayers.map((player: any) => (
            <Link
              key={player.id}
              href={`/teams/${player.teamId}`}
              className="flex items-center gap-4 rounded-xl bg-slate-800 p-4 border border-slate-700 hover:border-slate-600 hover:shadow-lg transition"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-700">
                  <img
                    src={`/api/players/${player.id}/avatar`}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="w-full h-full object-cover"
                    width={80}
                    height={80}
                  />
                </div>
                {/* Position badge */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                  {player.position}
                </div>
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-white truncate">
                  {player.firstName} {player.lastName}
                </h4>
                <p className="text-sm text-slate-400">
                  {player.team?.city} {player.team?.name}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-blue-400">{player.ovr}</span>
                    <span className="text-xs text-slate-500">OVR</span>
                  </div>
                  {player.pot > player.ovr && (
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-semibold text-green-400">{player.pot}</span>
                      <span className="text-xs text-slate-500">POT</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Teams Grid */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h3 className="mb-6 text-xl font-semibold text-white">Komandos</h3>
        {league?.teams ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {league.teams.map((team: any) => (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="block rounded-xl bg-slate-800 p-4 transition hover:bg-slate-700 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-white">{team.name}</h4>
                    <p className="text-sm text-slate-400">{team.city}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">
                      {team.players?.length > 0
                        ? Math.round(team.players.reduce((sum: number, p: any) => sum + p.ovr, 0) / team.players.length)
                        : 0}
                    </div>
                    <div className="text-xs text-slate-500">OVR</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-slate-800 p-8 text-center text-slate-400">
            Įkeliami duomenys...
          </div>
        )}
      </section>
    </main>
  );
}
