import Link from 'next/link';
import { PlayerAvatar } from '@/components/PlayerAvatar';

async function getTeam(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/teams/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const team = await getTeam(id);

  if (!team) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Komanda nerasta</h1>
          <Link href="/teams" className="mt-4 block text-blue-400">
            Grįžti į komandas
          </Link>
        </div>
      </main>
    );
  }

  const positionOrder = ['PG', 'SG', 'SF', 'PF', 'C'];
  const allPlayers = [...(team.playersByPosition?.PG || []), ...(team.playersByPosition?.SG || []), ...(team.playersByPosition?.SF || []), ...(team.playersByPosition?.PF || []), ...(team.playersByPosition?.C || [])];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/teams" className="flex items-center gap-2 text-slate-300 hover:text-white">
              ← Atgal
            </Link>
            <h1 className="text-xl font-bold text-white">{team.name}</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Team Header */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold">{team.name}</h2>
              <p className="mt-2 text-blue-100">{team.city}</p>
              {team.coach && (
                <p className="mt-2 text-sm text-blue-200">
                  Treneris: {team.coach.name}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold">{team.avgOvr || 0}</div>
              <div className="text-sm text-blue-200">Komandos OVR</div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-bold">{team.prestige || 50}</div>
              <div className="text-xs text-blue-200">Prestižas</div>
            </div>
            <div>
              <div className="text-2xl font-bold">€{(team.wageBudget || 0).toLocaleString()}</div>
              <div className="text-xs text-blue-200">Algu biudžetas</div>
            </div>
            <div>
              <div className="text-2xl font-bold">€{(team.transferBudget || 0).toLocaleString()}</div>
              <div className="text-xs text-blue-200">Transfer biudžetas</div>
            </div>
            <div>
              <div className="text-2xl font-bold">{team._count?.players || 0}</div>
              <div className="text-xs text-blue-200">Žaidėjai</div>
            </div>
          </div>
        </div>
      </section>

      {/* Players by Position */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <h3 className="mb-6 text-xl font-semibold text-white">Sudėtis</h3>

        <div className="space-y-8">
          {positionOrder.map((pos) => {
            const players = team.playersByPosition?.[pos] || [];
            if (players.length === 0) return null;

            return (
              <div key={pos}>
                <h4 className="mb-3 text-lg font-semibold text-blue-400">
                  {pos === 'PG' && 'Įžaidėjai (PG)'}
                  {pos === 'SG' && 'Atakuojantys Gynėjai (SG)'}
                  {pos === 'SF' && 'Mažiųjų Priašų (SF)'}
                  {pos === 'PF' && 'Didžiųjų Priašų (PF)'}
                  {pos === 'C' && 'Centrai (C)'}
                </h4>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {players.map((player: any) => (
                    <div
                      key={player.id}
                      className="rounded-lg bg-slate-800 p-4 border border-slate-700 hover:border-slate-600 transition"
                    >
                      <div className="flex items-center gap-4 mb-3">
                        {/* Avatar */}
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-700">
                            <img
                              src={`/api/players/${player.id}/avatar`}
                              alt={player.firstName}
                              className="w-full h-full object-cover"
                              width={64}
                              height={64}
                            />
                          </div>
                          {/* Position indicator */}
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center text-xs font-bold text-white">
                            {player.position}
                          </div>
                        </div>

                        <div className="flex-1">
                          <h5 className="font-semibold text-white">
                            {player.firstName} {player.lastName}
                          </h5>
                          <p className="text-sm text-slate-400">{player.age} metai</p>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-400">{player.ovr}</div>
                          <div className="text-xs text-slate-500">OVR</div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                        <div className="bg-slate-700/50 rounded p-2 text-center">
                          <div className="text-slate-500">3PT</div>
                          <div className="text-white font-semibold">{player.threePoint}</div>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2 text-center">
                          <div className="text-slate-500">SPD</div>
                          <div className="text-white font-semibold">{player.speed}</div>
                        </div>
                        <div className="bg-slate-700/50 rounded p-2 text-center">
                          <div className="text-slate-500">POT</div>
                          <div className="text-green-400 font-semibold">{player.pot}</div>
                        </div>
                      </div>

                      {/* Contract info */}
                      <div className="flex justify-between text-xs text-slate-400 border-t border-slate-700 pt-2">
                        <span>Alg: €{player.contract?.weeklyWage || 0}/sav.</span>
                        <span className={player.pot > player.ovr ? 'text-green-400' : ''}>
                          {player.pot > player.ovr ? '↑' : '='} {player.pot - player.ovr > 0 ? `+${player.pot - player.ovr}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
