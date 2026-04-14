import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">CS</span>
          </div>
          <span className="font-semibold text-lg tracking-tight">CorpSales Academy</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Entrar</Link>
          <Link href="/sign-up" className="text-sm bg-[#1a1a2e] text-white px-4 py-2 rounded-lg hover:bg-[#2d2d4e] transition-colors">Começar grátis</Link>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6 border border-blue-100">
          Treinamento corporativo para equipes de vendas
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-6 text-foreground">
          Sua equipe de vendas<br />
          <span className="text-[#1a1a2e]">preparada para vender mais.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Plataforma completa para criar trilhas de treinamento, certificar vendedores por produto e acompanhar o progresso da equipe em tempo real — com os seus próprios vídeos e conteúdos.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up" className="bg-[#1a1a2e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2d2d4e] transition-colors text-lg">Testar 30 dias grátis</Link>
          <Link href="#como-funciona" className="text-muted-foreground hover:text-foreground transition-colors text-lg">Ver como funciona →</Link>
        </div>
        <p className="text-xs text-muted-foreground mt-4">Sem cartão de crédito · Cancele quando quiser</p>
      </section>

      <section className="border-t border-b border-border py-12 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-[#1a1a2e]">+70%</p>
            <p className="text-sm text-muted-foreground mt-1">de aumento na taxa de conclusão</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#1a1a2e]">3 sem.</p>
            <p className="text-sm text-muted-foreground mt-1">para sua equipe treinada e certificada</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#1a1a2e]">100%</p>
            <p className="text-sm text-muted-foreground mt-1">do conteúdo criado pela sua empresa</p>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-center mb-4">Tudo que sua equipe precisa</h2>
        <p className="text-center text-muted-foreground mb-16 max-w-xl mx-auto">
          Do upload do vídeo até o certificado — uma plataforma que a sua empresa controla do início ao fim.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: '🎬', title: 'Suba seus próprios vídeos', desc: 'Faça upload dos treinamentos da sua empresa. Organize em módulos e trilhas por produto, área ou nível.' },
            { icon: '✅', title: 'Certifique por produto', desc: 'Quiz automático ao final de cada módulo. O vendedor só está habilitado quando aprovado.' },
            { icon: '📊', title: 'Acompanhe em tempo real', desc: 'Dashboard completo: quem concluiu, quem está atrasado, taxa de aprovação e ranking da equipe.' },
            { icon: '🔔', title: 'Notificações automáticas', desc: 'E-mails automáticos para vendedores com treinamentos pendentes. Ninguém fica para trás.' },
            { icon: '🏢', title: 'Multi-empresa', desc: 'Cada empresa tem seu ambiente separado, com seus próprios usuários, trilhas e dados.' },
            { icon: '📄', title: 'Relatórios para gestão', desc: 'Exporte relatórios de conclusão em PDF para reuniões ou auditorias. Dados sempre atualizados.' },
          ].map((f) => (
            <div key={f.title} className="bg-secondary/30 rounded-xl p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold mb-2 text-sm">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#1a1a2e] py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Como funciona</h2>
          <p className="text-blue-200 mb-16">Em menos de uma hora sua equipe já está treinando.</p>
          <div className="grid grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Crie sua conta', desc: 'Cadastre sua empresa e convide o time em minutos.' },
              { num: '2', title: 'Suba os treinamentos', desc: 'Faça upload dos seus vídeos e monte as trilhas por produto.' },
              { num: '3', title: 'Acompanhe os resultados', desc: 'Veja quem concluiu, quem está certificado e o impacto nas vendas.' },
            ].map((s) => (
              <div key={s.num} className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold mx-auto mb-4">{s.num}</div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-blue-200">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Planos simples e transparentes</h2>
          <p className="text-muted-foreground mb-12">Sem surpresas. Sem taxa de setup. Cancele quando quiser.</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white border border-border rounded-xl p-8 text-left">
              <p className="text-sm font-medium text-muted-foreground mb-1">Starter</p>
              <p className="text-4xl font-bold mb-1">R$1.500<span className="text-lg font-normal text-muted-foreground">/mês</span></p>
              <p className="text-sm text-muted-foreground mb-6">até 100 usuários</p>
              <ul className="space-y-2 text-sm text-muted-foreground mb-8">
                {['Trilhas e módulos ilimitados', 'Upload de vídeos próprios', 'Quizzes automáticos', 'Dashboard do gestor', 'Suporte por WhatsApp'].map((i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-green-600">✓</span> {i}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block text-center bg-[#1a1a2e] text-white py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d2d4e] transition-colors">Começar agora</Link>
            </div>
            <div className="bg-[#1a1a2e] border border-[#2d2d4e] rounded-xl p-8 text-left text-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium">Mais popular</div>
              <p className="text-sm font-medium text-blue-300 mb-1">Growth</p>
              <p className="text-4xl font-bold mb-1">R$3.000<span className="text-lg font-normal text-blue-300">/mês</span></p>
              <p className="text-sm text-blue-300 mb-6">até 300 usuários</p>
              <ul className="space-y-2 text-sm text-blue-100 mb-8">
                {['Tudo do Starter', 'Múltiplas unidades/filiais', 'Relatório PDF automático', 'Notificações automáticas', 'Suporte prioritário'].map((i) => (
                  <li key={i} className="flex items-center gap-2"><span className="text-blue-300">✓</span> {i}</li>
                ))}
              </ul>
              <Link href="/sign-up" className="block text-center bg-white text-[#1a1a2e] py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">Começar agora</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-secondary/30 border-t border-border py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Pronto para treinar sua equipe de vendas?</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">30 dias grátis, sem cartão de crédito. Configure em menos de 1 hora.</p>
        <Link href="/sign-up" className="inline-block bg-[#1a1a2e] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2d2d4e] transition-colors text-lg">Criar conta grátis</Link>
      </section>

      <footer className="border-t border-border py-8 px-6 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1a1a2e] rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">CS</span>
          </div>
          <span className="font-medium text-foreground">CorpSales Academy</span>
        </div>
        <p>© 2025 CorpSales Academy. Todos os direitos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacidade</a>
          <a href="#" className="hover:text-foreground transition-colors">Termos</a>
        </div>
      </footer>
    </main>
  )
}