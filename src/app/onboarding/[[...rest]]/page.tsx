'use client'
import { CreateOrganization, useOrganizationList } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function OnboardingPage() {
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  })
  const [isEmployee, setIsEmployee] = useState<boolean | null>(null)

  // Verifica se veio de um link de convite
  useEffect(() => {
    fetch('/api/check-invite')
      .then(r => r.json())
      .then(data => {
        if (data.companyId) {
          // É employee — vai direto sem criar org
          window.location.href = `/api/seed-company?companyId=${data.companyId}&role=EMPLOYEE`
        } else {
          setIsEmployee(false)
        }
      })
  }, [])

  useEffect(() => {
    if (!isLoaded || !setActive || isEmployee === false) return
    if (userMemberships?.data?.length) {
      setActive({ organization: userMemberships.data[0].organization.id })
        .then(() => { window.location.href = '/api/seed-company' })
    }
  }, [isLoaded, userMemberships?.data?.length, setActive, isEmployee])

  if (isEmployee === null || userMemberships?.data?.length) {
    return <p className='p-8'>Redirecionando...</p>
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='flex flex-col items-center gap-6 text-center'>
        <h1 className='text-2xl font-bold'>Bem-vindo ao CorpSales Academy</h1>
        <p className='text-muted-foreground'>Crie a organização da sua empresa para começar</p>
        <CreateOrganization afterCreateOrganizationUrl='/api/seed-company' />
      </div>
    </div>
  )
}