import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { logout } from '@/app/actions/auth'
import Link from 'next/link'

export default async function AppShell({
  children,
  clubId,
}: {
  children: React.ReactNode
  clubId?: string
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  // Clubs this user has an active (or shadow/outgoing) assignment in
  const now = new Date()
  const assignments = await prisma.roleAssignment.findMany({
    where: {
      userId: session.id,
      termStart: { lte: now },
      termEnd: { gte: now },
      status: { in: ['active', 'shadow', 'outgoing'] },
    },
    include: { club: true, role: true },
    orderBy: { club: { name: 'asc' } },
  })

  const activeClubId = clubId ?? assignments[0]?.clubId

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-parchment)' }}>
      {/* Sidebar */}
      <aside
        className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: 'var(--color-navy-deep)', minHeight: '100vh' }}
      >
        {/* Wordmark */}
        <div className="px-6 pt-7 pb-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <Link href="/">
            <span className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>
              Tenure
            </span>
          </Link>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-brass)' }}>Simon Business School</p>
        </div>

        {/* Club switcher */}
        {assignments.length > 0 && (
          <div className="px-4 pt-5 pb-2">
            <p className="text-xs font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Your clubs
            </p>
            <nav className="space-y-1">
              {assignments.map((a) => (
                <Link
                  key={a.id}
                  href={`/club/${a.clubId}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm"
                  style={{
                    background: a.clubId === activeClubId ? 'rgba(201,162,39,0.15)' : 'transparent',
                    color: a.clubId === activeClubId ? 'var(--color-brass)' : 'rgba(255,255,255,0.65)',
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                  >
                    {a.club.shortName.slice(0, 2)}
                  </span>
                  <span className="truncate">
                    <span className="block font-medium">{a.club.shortName}</span>
                    <span className="block text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{a.role.label}</span>
                  </span>
                  {a.status === 'shadow' && (
                    <span className="ml-auto text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(201,162,39,0.2)', color: 'var(--color-brass)' }}>
                      Shadow
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Nav links */}
        <nav className="px-4 pt-4 space-y-1">
          {activeClubId && (
            <>
              <NavItem href={`/club/${activeClubId}`} label="Workspace" />
              <NavItem href={`/club/${activeClubId}/hub`} label="Club Hub" />
            </>
          )}
          <NavItem href="/collab" label="Collaboration Board" />
          <NavItem href="/vendors" label="Vendor Directory" />
        </nav>

        {/* User footer */}
        <div className="mt-auto px-4 pb-6 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3">
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: 'var(--color-brass)', color: 'var(--color-navy-deep)' }}
            >
              {session.avatarInitials}
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-sm font-medium text-white truncate">{session.name}</span>
            </span>
          </div>
          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="text-xs w-full text-left px-2 py-1 rounded transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm transition-colors"
      style={{ color: 'rgba(255,255,255,0.55)' }}
    >
      {label}
    </Link>
  )
}
