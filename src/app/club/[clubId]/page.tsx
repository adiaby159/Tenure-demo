import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import AppShell from '@/components/AppShell'
import RoleOverviewPanel from '@/components/workspace/RoleOverviewPanel'
import CardBoard from '@/components/workspace/CardBoard'
import ReadinessMeter from '@/components/workspace/ReadinessMeter'
import { CardType } from '@prisma/client'

export default async function ClubWorkspacePage({
  params,
}: {
  params: Promise<{ clubId: string }>
}) {
  const { clubId } = await params
  const session = await getSession()
  if (!session) redirect('/login')

  const now = new Date()
  const assignment = await prisma.roleAssignment.findFirst({
    where: {
      userId: session.id,
      clubId,
      termStart: { lte: now },
      termEnd: { gte: now },
      status: { in: ['active', 'shadow', 'outgoing'] },
    },
    include: {
      role: { include: { template: true } },
      club: true,
    },
  })

  if (!assignment) notFound()

  const { role, club } = assignment
  const template = role.template

  // Fetch cards for this role in this club (server-side visibility enforcement)
  const cards = await prisma.card.findMany({
    where: {
      clubId,
      owningRoleId: role.id,
      archived: false,
      // shadow users get read-only access — still show cards
    },
    orderBy: { createdAt: 'desc' },
    include: { createdBy: true },
  })

  // Readiness: N of M required card types present + not archived (§8.8)
  const requiredTypes: CardType[] = (template?.requiredTypes ?? []) as CardType[]
  const presentTypes = new Set(cards.map((c) => c.type))
  const presentCount = requiredTypes.filter((t) => presentTypes.has(t)).length
  const readinessPct = requiredTypes.length > 0
    ? Math.round((presentCount / requiredTypes.length) * 100)
    : 100

  const overview = template?.overview as {
    scope: string
    duties: { label: string; detail: string }[]
  } | null

  return (
    <AppShell clubId={clubId}>
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-brass)' }}>
              {club.name}
            </p>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
              {role.label}
            </h1>
            {assignment.status === 'shadow' && (
              <div className="mt-2 inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full" style={{ background: 'rgba(201,162,39,0.15)', color: '#92721a' }}>
                <span>Shadow access — read-only until your term begins</span>
              </div>
            )}
          </div>
          <ReadinessMeter pct={readinessPct} present={presentCount} total={requiredTypes.length} />
        </div>

        {/* Role overview panel */}
        {overview && <RoleOverviewPanel scope={overview.scope} duties={overview.duties} roleLabel={role.label} />}

        {/* Card board */}
        <CardBoard
          cards={cards}
          roleKey={role.key}
          canWrite={assignment.status === 'active'}
          clubId={clubId}
          roleId={role.id}
        />
      </div>
    </AppShell>
  )
}
