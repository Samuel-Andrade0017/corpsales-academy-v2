import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', 'https://corpsales-academy.vercel.app'))
  }

  const clerkUser = await currentUser()
  if (!clerkUser) {
    return NextResponse.redirect(new URL('/sign-in', 'https://corpsales-academy.vercel.app'))
  }

  const orgs = await clerkClient.users.getOrganizationMembershipList({ userId })

  for (const membership of orgs.data) {
    const org = membership.organization
    const company = await db.company.upsert({
      where: { clerkOrgId: org.id },
      update: { name: org.name },
      create: { clerkOrgId: org.id, name: org.name },
    })

    await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        name: `${clerkUser.firstName ?? ''} ${clerkUser.lastName ?? ''}`.trim() || 'Usuário',
        companyId: company.id,
        role: 'ADMIN',
      },
    })
  }

  return NextResponse.redirect(new URL('/dashboard', 'https://corpsales-academy.vercel.app'))
}