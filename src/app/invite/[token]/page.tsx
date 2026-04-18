import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

interface Props {
  params: { token: string }
}

export default async function InvitePage({ params }: Props) {
  const { userId } = auth()

  const company = await db.company.findUnique({
    where: { inviteToken: params.token },
  })

  if (!company) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Link inválido</h1>
          <p className="text-gray-500 mt-2">
            Este link de convite não existe ou expirou.
          </p>
        </div>
      </div>
    )
  }

  // Se já está logado, vincula à empresa e vai pro dashboard
  if (userId) {
    const existingUser = await db.user.findUnique({
      where: { clerkId: userId },
    })

    if (!existingUser) {
      redirect(`/api/seed-company?token=${params.token}`)
    }

    redirect('/dashboard')
  }

  // Se não está logado, manda pro sign-up com o token
  redirect(`/sign-up?token=${params.token}`)
}