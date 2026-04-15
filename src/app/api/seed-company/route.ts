import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  if (!userId) return new NextResponse('Não autorizado', { status: 401 })

  const orgs = await clerkClient.users.getOrganizationMembershipList({ userId })

  for (const membership of orgs.data) {
    const org = membership.organization
    await db.company.upsert({
      where: { clerkOrgId: org.id },
      update: { name: org.name },
      create: { clerkOrgId: org.id, name: org.name },
    })
  }

  return NextResponse.json({ ok: true, count: orgs.data.length })
}