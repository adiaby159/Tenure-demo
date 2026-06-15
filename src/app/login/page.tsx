import { loginAs } from '@/app/actions/auth'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const PERSONAS = [
  { id: 'almamy', label: 'Almamy Diaby', role: 'President · SEA', initials: 'AD', email: 'almamy.diaby@simon.rochester.edu' },
  { id: 'yhoselin', label: 'Yhoselin Beltran', role: 'VP Finance & Ops · SEA', initials: 'YB', email: 'yhoselin.beltran@simon.rochester.edu' },
  { id: 'maya', label: 'Maya Cohen', role: 'VP Marketing · SEA', initials: 'MC', email: 'maya.cohen@simon.rochester.edu' },
  { id: 'quang', label: 'Quang Quach', role: 'VP Events · SEA', initials: 'QQ', email: 'quang.quach@simon.rochester.edu' },
  { id: 'felicitas', label: 'Felicitas Van Thienen', role: 'President · Net Impact', initials: 'FV', email: 'felicitas.vanthienen@simon.rochester.edu' },
]

export default async function LoginPage() {
  const session = await getSession()
  if (session) redirect('/')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--color-navy-deep)' }}>
      <div className="w-full max-w-md">
        {/* Logo / wordmark */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
            Tenure
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-brass)' }}>
            Institutional knowledge that survives leadership transitions.
          </p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: 'var(--color-navy)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Demo — sign in as
          </p>
          <div className="space-y-3">
            {PERSONAS.map((p) => (
              <form key={p.id} action={loginAs}>
                <input type="hidden" name="email" value={p.email} />
                <button
                  type="submit"
                  className="w-full flex items-center gap-4 rounded-xl px-4 py-3 text-left transition-colors"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ background: 'var(--color-brass)', color: 'var(--color-navy-deep)' }}
                  >
                    {p.initials}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{p.label}</span>
                    <span className="block text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{p.role}</span>
                  </span>
                </button>
              </form>
            ))}
          </div>
        </div>

        <p className="text-center mt-6 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Simon Business School · Pilot 2026–27
        </p>
      </div>
    </div>
  )
}
