import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { orgId, userId } = auth()
    if (!orgId || !userId) return new NextResponse('Não autorizado', { status: 401 })

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 })

    await clerkClient.organizations.createOrganizationInvitation({
      organizationId: orgId,
      emailAddress: email,
      role: 'org:member',
      inviterUserId: userId,
      redirectUrl: 'https://corpsales-academy.vercel.app/dashboard',
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('[INVITE_POST]', error)
    return NextResponse.json({ error: error?.errors?.[0]?.message ?? 'Erro ao enviar convite' }, { status: 500 })
  }
}