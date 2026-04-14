import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new NextResponse('Assinatura inválida', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const orgId = session.metadata?.orgId
    const plan = session.metadata?.plan as 'STARTER' | 'GROWTH' | 'ENTERPRISE'

    if (orgId && plan) {
      await db.company.update({
        where: { clerkOrgId: orgId },
        data: {
          plan,
          stripeId: session.customer as string,
        },
      })
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    await db.company.updateMany({
      where: { stripeId: subscription.customer as string },
      data: { plan: 'STARTER' },
    })
  }

  return NextResponse.json({ received: true })
}
