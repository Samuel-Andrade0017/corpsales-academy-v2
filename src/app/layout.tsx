import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CorpSales Academy — Treinamento para Equipes de Vendas',
  description: 'Plataforma para treinar, certificar e acompanhar equipes de vendas.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={{
      locale: 'pt-BR',
      signIn: {
        start: {
          title: 'Entrar na sua conta',
          subtitle: 'Bem-vindo de volta!',
          actionText: 'Não tem uma conta?',
          actionLink: 'Cadastre-se',
        },
      },
      signUp: {
        start: {
          title: 'Criar sua conta',
          subtitle: 'Bem-vindo! Preencha os dados para começar.',
          actionText: 'Já tem uma conta?',
          actionLink: 'Entrar',
        },
      },
      userButton: {
        action__signOut: 'Sair',
        action__manageAccount: 'Gerenciar conta',
      },
      formFieldLabel__emailAddress: 'E-mail',
      formFieldLabel__password: 'Senha',
      formFieldLabel__firstName: 'Nome',
      formFieldLabel__lastName: 'Sobrenome',
      formButtonPrimary: 'Continuar',
      dividerText: 'ou',
      socialButtonsBlockButton: 'Continuar com {{provider}}',
      footerActionLink__useAnotherMethod: 'Usar outro método',
    } as any}>
      <html lang="pt-BR">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}