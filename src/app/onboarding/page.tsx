'use client'

import { useOrganizationList } from '@clerk/nextjs'
import { CreateOrganization } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  useEffect(() => {
    if (!isLoaded || !setActive) return
    if (userMemberships?.data?.length) {
      setActive({ organization: userMemberships.data[0].organization.id }).then(() => {
        setTimeout(() => { window.location.replace('/dashboard') }, 1500)
      })
    }
  }, [isLoaded, userMemberships?.data?.length])

  if (!isLoaded) return <p className="p-8">Carregando...</p>

  if (userMemberships?.data?.length) {
    return <p className="p-8">Redirecionando para o dashboard...</p>
  }

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