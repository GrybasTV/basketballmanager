import Link from 'next/link';

async function getTeams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/teams`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function TeamsPage() {
  const teams = await getTeams();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              ← Atgal
            </Link>
            <h1 className="text-2xl font-bold text-white">Komandos</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Teams List */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 rounded-lg bg-slate-800 p-4">
          <p className="text-slate-400">
            Viso komandų: <span className="font-bold text-white">{teams.length}</span>
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {teams.map((team: any) => (
            <Link
              key={team.id}
              href={`/teams/${team.id}`}
              className="rounded-xl bg-slate-800 p-6 transition hover:bg-slate-700 hover:shadow-xl border border-slate-700 hover:border-slate-600"
            >
              {/* Team Logo */}
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-600 bg-slate-700">
                  <img
                    src={`/api/teams/${team.id}/logo`}
                    alt={`${team.name} logo`}
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                  />
                </div>
              </div>

              {/* Team Info */}
              <h3 className="text-xl font-bold text-white text-center">{team.name}</h3>
              <p className="text-slate-400 text-center mb-4">{team.city}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{team.avgOvr || 0}</div>
                  <div className="text-xs text-slate-500">Vid. OVR</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{team._count?.players || 0}</div>
                  <div className="text-xs text-slate-500">Žaidėjai</div>
                </div>
              </div>

              {team.coach && (
                <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                  <p className="text-sm text-slate-400">
                    Treneris: <span className="text-white">{team.coach.name}</span>
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
