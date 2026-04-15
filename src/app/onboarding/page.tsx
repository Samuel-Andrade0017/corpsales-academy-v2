import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CreateOrganization } from '@clerk/nextjs'

export default async function OnboardingPage() {
  const { userId, orgId } = auth()

  if (!userId) redirect('/sign-in')
  if (orgId) redirect('/dashboard') // já tem org, vai pro dashboard

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bem-vindo ao CorpSales Academy</h1>
          <p className="text-muted-foreground mt-2">
            Crie a organização da sua empresa para começar
          </p>
        </div>
        <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
      </div>
    </div>
  )
}