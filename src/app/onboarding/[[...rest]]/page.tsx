'use client'
import { CreateOrganization, useOrganizationList } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function OnboardingPage() {
  const { userMemberships, setActive, isLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  })
  const [isEmployee, setIsEmployee] = useState<boolean | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Tenta pegar o companyId da URL ou do sessionStorage
    const companyId = searchParams.get('companyId') || sessionStorage.getItem('invite_company_id')

    if (companyId) {
      sessionStorage.removeItem('invite_company_id')
      window.location.href = `/api/seed-company?companyId=${companyId}`
    } else {
      setIsEmployee(false)
    }
  }, [searchParams])

  useEffect(() => {
    if (!isLoaded || !setActive || isEmployee !== false) return
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