import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST() {
  try {
    const { userId, orgId } = auth()
    if (!userId || !orgId) return new NextResponse('Não autorizado', { status: 401 })

    const clerkUser = await currentUser()
    if (!clerkUser) return new NextResponse('Não autorizado', { status: 401 })

    const company = await db.company.findUnique({ where: { clerkOrgId: orgId } })
    if (!company) return new NextResponse('Empresa não encontrada', { status: 404 })

    // Se já tem stripeId, vai para o portal do cliente
    if (company.stripeId) {
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: company.stripeId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      })
      return NextResponse.json({ url: portalSession.url })
    }

    // Cria nova sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer_email: clerkUser.emailAddresses[0]?.emailAddress,
      line_items: [{ price: process.env.STRIPE_PRO_PRICE_ID!, quantity: 1 }],
      metadata: { orgId, companyId: company.id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('[STRIPE_CHECKOUT]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}