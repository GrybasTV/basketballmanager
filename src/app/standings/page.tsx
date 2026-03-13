import Link from 'next/link';

async function getLeagueId() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leagues`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  const leagues = await res.json();
  return leagues[0]?.id || null;
}

async function getStandings(leagueId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/leagues/${leagueId}/standings`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function StandingsPage() {
  const leagueId = await getLeagueId();
  const standings = leagueId ? await getStandings(leagueId) : [];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              ← Atgal
            </Link>
            <h1 className="text-2xl font-bold text-white">Turnyrinė Lentelė</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Standings Table */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="overflow-hidden rounded-xl bg-slate-800 shadow-xl">
          <table className="w-full">
            <thead className="bg-slate-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
                  Vieta
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-300">
                  Komanda
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-slate-300">
                  R
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-slate-300">
                  P
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-slate-300">
                  L
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-slate-300">
                  %
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-slate-300">
                  +
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-slate-300">
                  OVR
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {standings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    Kol kas nėra sužaistų rungtynių
                  </td>
                </tr>
              ) : (
                standings.map((team: any, index: number) => (
                  <tr
                    key={team.id}
                    className={`transition ${
                      index < 4 ? 'bg-green-900/10' : index >= standings.length - 2 ? 'bg-red-900/10' : ''
                    } hover:bg-slate-700`}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-bold ${
                          index < 3
                            ? 'bg-yellow-500 text-slate-900'
                            : index < 6
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-600 text-white'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Link
                        href={`/teams/${team.id}`}
                        className="font-semibold text-white hover:text-blue-400"
                      >
                        {team.city} {team.name}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-slate-300">
                      {team.gamesPlayed}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center font-semibold text-green-400">
                      {team.wins}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center font-semibold text-red-400">
                      {team.losses}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-slate-300">
                      {team.winPercentage}%
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-center text-slate-300">
                      <span className={team.pointDiff > 0 ? 'text-green-400' : team.pointDiff < 0 ? 'text-red-400' : ''}>
                        {team.pointDiff > 0 ? '+' : ''}{team.pointDiff}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right font-semibold text-blue-400">
                      {team.avgOvr}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-4 flex gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-900/30 border border-green-800" />
            <span>Play-off zona</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-900/30 border border-red-800" />
            <span>Pavojinga zona</span>
          </div>
        </div>
      </section>
    </main>
  );
}
