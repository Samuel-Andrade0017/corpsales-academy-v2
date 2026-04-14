import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const { orgId } = auth()
    if (!orgId) return new NextResponse('Não autorizado', { status: 401 })

    const company = await db.company.findUnique({ where: { clerkOrgId: orgId } })
    if (!company) return new NextResponse('Empresa não encontrada', { status: 404 })

    const users = await db.user.findMany({
      where: { companyId: company.id },
      include: {
        certifications: { where: { passed: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('[USERS_GET]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}
