export const runtime = 'edge';
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { EconomyManager } from "@/components/EconomyManager"

export default async function EconomyPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/login")
  }

  if (!session.user.teamId) {
    return (
      <div className="min-h-screen bg-slate-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Ekonomika</h1>
          <p className="text-slate-400">Jūs neturite priskirtos komandos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-blue-400 hover:text-blue-300">← Atgal</a>
            <h1 className="text-2xl font-bold">💰 Finansų Valdymas</h1>
          </div>
          <div className="flex items-center gap-4">
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
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-3xl font-bold mb-2">Komandos Finansai</h2>
          <p className="text-slate-400">
            Stebekite biudžetą, algas ir Luxury Tax.
          </p>
        </div>

        <EconomyManager />
      </main>
    </div>
  )
}
