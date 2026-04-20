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

  // Se já está logado, vincula direto
  if (userId) {
    redirect(`/api/seed-company?companyId=${company.id}`)
  }

  // Manda pro sign-up com companyId na URL
  redirect(`/sign-up?companyId=${company.id}`)
}