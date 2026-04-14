import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    return new NextResponse('Webhook secret não configurado', { status: 500 })
  }

  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse('Headers svix ausentes', { status: 400 })
  }

  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: any

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    })
  } catch {
    return new NextResponse('Assinatura inválida', { status: 400 })
  }

  const { type, data } = evt

  // Organização criada → cria empresa no banco
  if (type === 'organization.created') {
    await db.company.upsert({
      where: { clerkOrgId: data.id },
      update: { name: data.name },
      create: { clerkOrgId: data.id, name: data.name },
    })
  }

  // Membro adicionado à org → cria usuário no banco
  if (type === 'organizationMembership.created') {
    const company = await db.company.findUnique({
      where: { clerkOrgId: data.organization.id },
    })
    if (company) {
      await db.user.upsert({
        where: { clerkId: data.public_user_data.user_id },
        update: {},
        create: {
          clerkId: data.public_user_data.user_id,
          email: data.public_user_data.identifier,
          name: `${data.public_user_data.first_name ?? ''} ${data.public_user_data.last_name ?? ''}`.trim() || 'Usuário',
          companyId: company.id,
          role: data.role === 'org:admin' ? 'ADMIN' : 'EMPLOYEE',
        },
      })
    }
  }

  return NextResponse.json({ received: true })
}
