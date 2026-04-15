'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { CreateOrganization } from '@clerk/nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const { userMemberships, setActive } = useOrganizationList({ userMemberships: true })
  const router = useRouter()

  useEffect(() => {
  if (userMemberships?.data?.length && setActive) {
    setActive({ organization: userMemberships.data[0].organization.id })
      .then(() => {
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000) // aguarda 1s para o Clerk atualizar o token
      })
  }
}, [userMemberships?.data, setActive])

  // Só mostra CreateOrganization se não tiver nenhuma org
  if (userMemberships?.isLoading) return <p>Carregando...</p>
  if (userMemberships?.data?.length) return <p>Redirecionando...</p>

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