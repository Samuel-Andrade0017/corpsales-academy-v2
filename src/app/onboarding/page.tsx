'use client'
import { CreateOrganization, useOrganizationList } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function OnboardingPage() {
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  })

  useEffect(() => {
    if (!isLoaded || !setActive) return
    if (userMemberships?.data?.length) {
      setActive({ organization: userMemberships.data[0].organization.id })
        .then(() => { window.location.href = '/dashboard' })
    }
  }, [isLoaded, userMemberships?.data?.length, setActive])

  if (!isLoaded || userMemberships?.data?.length) {
    return <p className="p-8">Redirecionando para o dashboard...</p>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-2xl font-bold">Bem-vindo ao CorpSales Academy</h1>
        <p className="text-muted-foreground">Crie a organização da sua empresa para começar</p>
        <CreateOrganization afterCreateOrganizationUrl="/dashboard" />
      </div>
    </div>
  )
}