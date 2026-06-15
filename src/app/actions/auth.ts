'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAs(formData: FormData) {
  const email = formData.get('email') as string
  if (!email) return

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return

  const cookieStore = await cookies()
  cookieStore.set('tenure_user_id', user.id, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })

  redirect('/')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('tenure_user_id')
  redirect('/login')
}
