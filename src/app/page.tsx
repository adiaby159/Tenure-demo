import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export default async function Home() {
  const session = await getSession()
  if (!session) redirect('/login')

  const now = new Date()
  const first = await prisma.roleAssignment.findFirst({
    where: {
      userId: session.id,
      termStart: { lte: now },
      termEnd: { gte: now },
      status: { in: ['active', 'shadow', 'outgoing'] },
    },
    orderBy: { termStart: 'desc' },
  })

  if (first) redirect(`/club/${first.clubId}`)
  redirect('/login')
}
