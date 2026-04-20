'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function InviteRedirectPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const companyId = searchParams.get('companyId')
    if (companyId) {
      sessionStorage.setItem('invite_company_id', companyId)
    }
    window.location.href = '/sign-up'
  }, [searchParams])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-muted-foreground">Redirecionando...</p>
    </div>
  )
}