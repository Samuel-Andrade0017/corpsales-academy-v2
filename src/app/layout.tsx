import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'

export const metadata: Metadata = {
  title: 'CorpSales Academy — Treinamento para Equipes de Vendas',
  description: 'Plataforma para treinar, certificar e acompanhar equipes de vendas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="pt-BR">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}