export const runtime = 'edge';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

async function getMatches() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/matches`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json() as any;
}

async function simulateMatch(matchId: string) {
  'use server';
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/matches/${matchId}/simulate`, {
    method: 'POST',
  });
  revalidatePath('/matches');
  revalidatePath('/standings');
  return res.json();
}

export default async function MatchesPage() {
  const matches = await getMatches();

  // Group by match day
  const matchesByDay = matches.reduce((acc: any, match: any) => {
    if (!acc[match.matchDay]) {
      acc[match.matchDay] = [];
    }
    acc[match.matchDay].push(match);
    return acc;
  }, {});

  const sortedDays = Object.keys(matchesByDay).sort((a, b) => parseInt(a) - parseInt(b));

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 text-slate-300 hover:text-white">
              ← Atgal
            </Link>
            <h1 className="text-2xl font-bold text-white">Rungtynės</h1>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Matches */}
      <section className="mx-auto max-w-7xl px-4 py-8">
        {sortedDays.length === 0 ? (
          <div className="rounded-lg bg-slate-800 p-8 text-center text-slate-400">
            Nėra rungtynių
          </div>
        ) : (
          <div className="space-y-8">
            {sortedDays.map((day) => (
              <div key={day}>
                <h3 className="mb-4 text-lg font-semibold text-white">
                  {day} diena
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {matchesByDay[day].map((match: any) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function MatchCard({ match }: { match: any }) {
  const isPlayed = match.isPlayed;

  return (
    <div
      className={`rounded-xl bg-slate-800 p-6 border ${
        isPlayed ? 'border-slate-600' : 'border-slate-700'
      } transition hover:shadow-lg`}
    >
      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-right">
          <Link
            href={`/teams/${match.homeTeam.id}`}
            className="font-semibold text-white hover:text-blue-400"
          >
            {match.homeTeam.city}
          </Link>
          <div className="text-xs text-slate-500">Namų</div>
        </div>

        <div className="px-4">
          {isPlayed ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {match.homeScore} - {match.awayScore}
              </div>
            </div>
          ) : (
            <div className="text-center text-slate-500">vs</div>
          )}
        </div>

        <div className="flex-1 text-left">
          <Link
            href={`/teams/${match.awayTeam.id}`}
            className="font-semibold text-white hover:text-blue-400"
          >
            {match.awayTeam.city}
          </Link>
          <div className="text-xs text-slate-500">Svečiai</div>
        </div>
      </div>

      {/* Simulate Button */}
      {!isPlayed && (
        <form
          action={async () => {
            'use server';
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/matches/${match.id}/simulate`, {
              method: 'POST',
            });
            // Revalidate
            revalidatePath('/matches');
            revalidatePath('/standings');
          }}
          className="mt-4"
        >
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700"
          >
            ▶ Simuliuoti
          </button>
        </form>
      )}

      {/* Match Info */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{match.matchDay} diena</span>
        {isPlayed && (
          <Link
            href={`/matches/${match.id}`}
            className="text-blue-400 hover:text-blue-300"
          >
            Peržiūrėti →
          </Link>
        )}
      </div>
    </div>
  );
}
