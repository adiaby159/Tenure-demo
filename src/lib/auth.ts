/**
 * Central authorization module (bible §7/§12/§13).
 * ALL permission decisions flow through here. Default-deny.
 * Permission state is derived from RoleAssignment + dates — never trusted from the client.
 *
 * Stub phase: session is a simple persona cookie. Google SSO slots in here without
 * changing the contract — callers always receive a resolved AuthUser.
 */

import { prisma } from '@/lib/prisma'
import { AssignmentStatus, Visibility } from '@prisma/client'
import { cookies } from 'next/headers'

export type AuthUser = {
  id: string
  name: string
  email: string
  avatarInitials: string
}

export type Permission =
  | 'card:read'
  | 'card:write'
  | 'hub:read'
  | 'hub:write'
  | 'collab:read'
  | 'collab:write'
  | 'vendor:read'
  | 'ose:read'
  | 'ose:approve'

// ---------------------------------------------------------------------------
// Session resolution (stub — replace internals with Auth.js in production)
// ---------------------------------------------------------------------------

export async function getSession(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get('tenure_user_id')?.value
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return null

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarInitials: user.avatarInitials,
  }
}

// ---------------------------------------------------------------------------
// Assignment resolution
// ---------------------------------------------------------------------------

export type AssignmentContext = {
  status: AssignmentStatus
  roleKey: string
  roleId: string
  clubId: string
}

export async function getAssignment(
  userId: string,
  clubId: string,
): Promise<AssignmentContext | null> {
  const now = new Date()
  const assignment = await prisma.roleAssignment.findFirst({
    where: {
      userId,
      clubId,
      termStart: { lte: now },
      termEnd: { gte: now },
      status: { in: ['shadow', 'active', 'outgoing'] },
    },
    include: { role: true },
    orderBy: { termStart: 'desc' },
  })
  if (!assignment) return null
  return {
    status: assignment.status,
    roleKey: assignment.role.key,
    roleId: assignment.role.id,
    clubId: assignment.clubId,
  }
}

// ---------------------------------------------------------------------------
// Core permission check — the single gate (§7/§12)
// ---------------------------------------------------------------------------

export async function can(
  userId: string,
  clubId: string,
  permission: Permission,
): Promise<boolean> {
  const ctx = await getAssignment(userId, clubId)
  if (!ctx) return false

  const { status } = ctx

  switch (permission) {
    case 'card:read':
      return status === 'active' || status === 'shadow' || status === 'outgoing'
    case 'card:write':
      return status === 'active'
    case 'hub:read':
      return status === 'active' || status === 'outgoing'
    case 'hub:write':
      return status === 'active'
    case 'collab:read':
    case 'collab:write':
      return status === 'active'
    case 'vendor:read':
      return status === 'active'
    case 'ose:read':
    case 'ose:approve':
      // OSE is handled by a separate role flag (future: ose_role on User).
      // For now, block all OSE-specific writes from regular users.
      return false
    default:
      return false
  }
}

// ---------------------------------------------------------------------------
// Card visibility enforcement (§7.3)
// ---------------------------------------------------------------------------

export async function canReadCard(
  userId: string,
  card: { clubId: string; owningRoleId: string; visibility: Visibility },
): Promise<boolean> {
  const ctx = await getAssignment(userId, card.clubId)
  if (!ctx) return false

  const { status, roleId } = ctx

  switch (card.visibility) {
    case 'role':
      // Role holder + that club's president can read.
      if (roleId === card.owningRoleId) return status !== 'archived'
      // Check if user is the president of this club.
      return isPresident(ctx)
    case 'club':
      return status === 'active' || status === 'shadow' || status === 'outgoing'
    case 'global':
      return status === 'active'
    case 'admin':
      return false // OSE only — handled separately
    default:
      return false
  }
}

function isPresident(ctx: AssignmentContext): boolean {
  return ctx.roleKey === 'president' && ctx.status === 'active'
}
