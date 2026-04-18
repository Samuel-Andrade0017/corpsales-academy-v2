import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET(req: Request) {
  const { userId } = auth()
  const baseUrl = 'https://corpsales-academy.vercel.app'

  if (!userId) return NextResponse.redirect(new URL('/sign-in', baseUrl))

  const clerkUser = await currentUser()
  if (!clerkUser) return NextResponse.redirect(new URL('/sign-in', baseUrl))

  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  // Fluxo por link de convite (vendedor)
  if (token) {
    const company = await db.company.findUnique({
      where: { inviteToken: token },
    })

    if (!company) {
      return NextResponse.redirect(new URL('/sign-in', baseUrl))
    }

    await db.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
        name: (clerkUser.firstName ?? '') + ' ' + (clerkUser.lastName ?? ''),
        companyId: company.id,
        role: 'EMPLOYEE',
      },
    })

    return NextResponse.redirect(new URL('/dashboard', baseUrl))
  }

  // Fluxo normal (gestor criando empresa via Clerk org)
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
        name: (clerkUser.firstName ?? '') + ' ' + (clerkUser.lastName ?? ''),
        companyId: company.id,
        role: 'ADMIN',
      },
    })
  }

  return NextResponse.redirect(new URL('/dashboard', baseUrl))
}