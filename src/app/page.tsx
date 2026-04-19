export default function HomePage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --red: #E3001B; --red-dark: #b5001a;
          --dark: #0a0a0a; --dark-2: #111111; --dark-3: #1a1a1a; --dark-4: #222222;
          --white: #ffffff; --gray: #888888; --gray-light: #cccccc;
          --border: rgba(255,255,255,0.08);
        }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; background: var(--dark); color: var(--white); overflow-x: hidden; line-height: 1.6; }
        nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 60px; display: flex; align-items: center; justify-content: space-between; background: rgba(10,10,10,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); }
        .logo { display: flex; align-items: center; gap: 10px; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; color: var(--white); text-decoration: none; }
        .logo-icon { width: 32px; height: 32px; background: var(--red); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 800; }
        .nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
        .nav-links a { color: var(--gray-light); text-decoration: none; font-size: 14px; transition: color 0.2s; }
        .nav-links a:hover { color: var(--white); }
        .nav-cta { background: var(--red) !important; color: var(--white) !important; padding: 10px 24px; border-radius: 8px; font-weight: 500 !important; }
        .hero { min-height: 100vh; display: flex; align-items: center; padding: 140px 60px 100px; position: relative; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(227,0,27,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 20% 80%, rgba(227,0,27,0.06) 0%, transparent 50%); }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%); }
        .hero-content { position: relative; z-index: 2; max-width: 700px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(227,0,27,0.15); border: 1px solid rgba(227,0,27,0.3); color: #ff6b6b; padding: 6px 16px; border-radius: 99px; font-size: 13px; font-weight: 500; margin-bottom: 32px; }
        .pulse { width: 6px; height: 6px; background: var(--red); border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
        h1 { font-family: 'Syne', sans-serif; font-size: clamp(48px, 6vw, 80px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; margin-bottom: 24px; }
        .red { color: var(--red); }
        .hero-sub { font-size: 18px; color: var(--gray-light); max-width: 520px; line-height: 1.7; margin-bottom: 40px; font-weight: 300; }
        .hero-actions { display: flex; align-items: center; gap: 16px; }
        .btn-primary { background: var(--red); color: var(--white); padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 500; text-decoration: none; transition: all 0.2s; display: inline-block; }
        .btn-primary:hover { background: var(--red-dark); transform: translateY(-1px); }
        .btn-ghost { color: var(--gray-light); font-size: 15px; text-decoration: none; transition: color 0.2s; }
        .btn-ghost:hover { color: var(--white); }
        .social-proof { padding: 60px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--dark-2); }
        .social-proof-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; gap: 60px; flex-wrap: wrap; }
        .social-proof-label { font-size: 12px; color: var(--gray); text-transform: uppercase; letter-spacing: 0.1em; }
        .stats-row { display: flex; gap: 48px; flex-wrap: wrap; }
        .stat-num { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 800; line-height: 1; }
        .stat-label { font-size: 12px; color: var(--gray); margin-top: 4px; }
        section { padding: 100px 60px; }
        .section-inner { max-width: 1100px; margin: 0 auto; }
        .section-tag { font-size: 12px; color: var(--red); text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600; margin-bottom: 16px; }
        h2 { font-family: 'Syne', sans-serif; font-size: clamp(32px, 4vw, 52px); font-weight: 800; line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 20px; }
        .section-sub { font-size: 17px; color: var(--gray-light); max-width: 560px; font-weight: 300; line-height: 1.7; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
        .feature-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 16px; padding: 32px; transition: border-color 0.2s, transform 0.2s; }
        .feature-card:hover { border-color: rgba(227,0,27,0.3); transform: translateY(-4px); }
        .feature-icon { width: 44px; height: 44px; background: rgba(227,0,27,0.12); border: 1px solid rgba(227,0,27,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 20px; }
        .feature-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .feature-desc { font-size: 14px; color: var(--gray); line-height: 1.6; }
        .how-bg { background: var(--dark-2); }
        .steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin-top: 60px; position: relative; }
        .steps::before { content: ''; position: absolute; top: 28px; left: 12.5%; right: 12.5%; height: 1px; background: var(--border); z-index: 0; }
        .step { text-align: center; padding: 0 20px; }
        .step-num { width: 56px; height: 56px; background: var(--dark-3); border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: var(--red); position: relative; z-index: 1; }
        .step-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 8px; }
        .step-desc { font-size: 13px; color: var(--gray); line-height: 1.5; }
        .preview-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-top: 60px; }
        .preview-list { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }
        .preview-item { display: flex; align-items: flex-start; gap: 14px; }
        .preview-bullet { width: 20px; height: 20px; flex-shrink: 0; background: rgba(227,0,27,0.15); border: 1px solid rgba(227,0,27,0.3); border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: var(--red); margin-top: 2px; }
        .preview-item-text { font-size: 15px; color: var(--gray-light); line-height: 1.5; }
        .dashboard-mock { background: var(--dark-3); border: 1px solid var(--border); border-radius: 20px; padding: 24px; position: relative; overflow: hidden; }
        .dashboard-mock::before { content: ''; position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(227,0,27,0.15) 0%, transparent 70%); }
        .mock-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .mock-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
        .mock-badge { font-size: 11px; background: rgba(59,109,17,0.2); color: #7cb342; padding: 3px 10px; border-radius: 99px; border: 1px solid rgba(59,109,17,0.3); }
        .mock-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .mock-card { background: var(--dark-4); border: 1px solid var(--border); border-radius: 12px; padding: 16px; }
        .mock-card-label { font-size: 11px; color: var(--gray); margin-bottom: 6px; }
        .mock-card-val { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; }
        .mock-card-val.green { color: #7cb342; }
        .mock-card-val.red { color: var(--red); }
        .mock-bar-title { font-size: 12px; color: var(--gray); margin-bottom: 12px; }
        .mock-bars { display: flex; flex-direction: column; gap: 8px; }
        .mock-bar-row { display: flex; align-items: center; gap: 10px; }
        .mock-bar-name { font-size: 12px; color: var(--gray-light); width: 80px; flex-shrink: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .mock-bar-track { flex: 1; height: 6px; background: var(--dark-4); border-radius: 99px; overflow: hidden; }
        .mock-bar-fill { height: 100%; border-radius: 99px; background: var(--red); }
        .mock-bar-pct { font-size: 11px; color: var(--gray); width: 32px; text-align: right; }
        .testimonials-bg { background: var(--dark-2); }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
        .testimonial-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 16px; padding: 32px; }
        .testimonial-stars { color: #f59e0b; font-size: 14px; margin-bottom: 16px; }
        .testimonial-text { font-size: 15px; color: var(--gray-light); line-height: 1.7; margin-bottom: 24px; font-style: italic; }
        .testimonial-author { display: flex; align-items: center; gap: 12px; }
        .author-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--red); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; }
        .author-name { font-size: 14px; font-weight: 500; }
        .author-role { font-size: 12px; color: var(--gray); }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 60px; }
        .pricing-card { background: var(--dark-3); border: 1px solid var(--border); border-radius: 16px; padding: 36px; position: relative; }
        .pricing-card.featured { border-color: var(--red); background: linear-gradient(135deg, rgba(227,0,27,0.08) 0%, var(--dark-3) 60%); }
        .pricing-popular { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); background: var(--red); color: var(--white); font-size: 11px; font-weight: 600; padding: 4px 16px; border-radius: 99px; white-space: nowrap; }
        .pricing-plan { font-size: 12px; color: var(--gray); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; }
        .pricing-price { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; margin-bottom: 4px; line-height: 1; }
        .pricing-price span { font-size: 18px; font-weight: 400; color: var(--gray); }
        .pricing-period { font-size: 13px; color: var(--gray); margin-bottom: 28px; }
        .pricing-features { list-style: none; margin-bottom: 32px; }
        .pricing-features li { display: flex; align-items: center; gap: 10px; font-size: 14px; color: var(--gray-light); padding: 8px 0; border-bottom: 1px solid var(--border); }
        .pricing-features li:last-child { border-bottom: none; }
        .pricing-features li::before { content: '✓'; color: var(--red); font-weight: 700; font-size: 12px; flex-shrink: 0; }
        .btn-outline { display: block; text-align: center; border: 1px solid var(--border); color: var(--white); padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; transition: all 0.2s; }
        .btn-outline:hover { border-color: var(--red); color: var(--red); }
        .pricing-card.featured .btn-outline { background: var(--red); border-color: var(--red); }
        .cta-section { padding: 100px 60px; background: linear-gradient(135deg, rgba(227,0,27,0.15) 0%, rgba(10,10,10,0) 60%); border-top: 1px solid var(--border); text-align: center; }
        footer { padding: 60px; border-top: 1px solid var(--border); background: var(--dark-2); }
        .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; }
        .footer-copy { font-size: 13px; color: var(--gray); }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { font-size: 13px; color: var(--gray); text-decoration: none; transition: color 0.2s; }
        .footer-links a:hover { color: var(--white); }
      `}</style>

      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet" />

      <nav>
        <a href="#" className="logo">
          <div className="logo-icon">CS</div>
          CorpSales Academy
        </a>
        <ul className="nav-links">
          <li><a href="#funcionalidades">Funcionalidades</a></li>
          <li><a href="#como-funciona">Como funciona</a></li>
          <li><a href="#planos">Planos</a></li>
          <li><a href="/sign-in" className="nav-cta">Entrar</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse"></span>
            Plataforma B2B para times de vendas
          </div>
          <h1>Treine.<br />Certifique.<br /><span className="red">Venda mais.</span></h1>
          <p className="hero-sub">A plataforma que transforma sua equipe de vendas em especialistas certificados. Crie trilhas, aplique quizzes e acompanhe quem está pronto para vender.</p>
          <div className="hero-actions">
            <a href="/sign-up" className="btn-primary">Testar 30 dias grátis</a>
            <a href="#como-funciona" className="btn-ghost">Como funciona →</a>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <div className="social-proof">
        <div className="social-proof-inner">
          <p className="social-proof-label">Resultados reais</p>
          <div className="stats-row">
            {[
              { num: '3x', label: 'mais rápido no onboarding' },
              { num: '87%', label: 'taxa de conclusão média' },
              { num: '200+', label: 'vendedores treinados' },
              { num: 'R$997', label: 'custo médio/vendedor no Brasil' },
            ].map((s) => (
              <div key={s.label} className="stat">
                <div className="stat-num"><span className="red">{s.num}</span></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="funcionalidades">
        <div className="section-inner">
          <p className="section-tag">Funcionalidades</p>
          <h2>Tudo que você precisa para <span className="red">capacitar seu time</span></h2>
          <p className="section-sub">Diferente de LMSs genéricos, o CorpSales Academy foi construído especificamente para gestores comerciais.</p>
          <div className="features-grid">
            {[
              { icon: '📚', title: 'Trilhas de Treinamento', desc: 'Crie cursos com módulos sequenciais sobre seus produtos e técnicas de venda. Sem precisar de equipe de TI.' },
              { icon: '✨', title: 'Quiz com IA', desc: 'Cole o conteúdo do módulo e a IA gera automaticamente 5 perguntas de múltipla escolha. Em segundos.' },
              { icon: '🏆', title: 'Ranking e Certificação', desc: 'Ranking de acertos entre vendedores gera competição saudável. Certificação automática ao final da trilha.' },
              { icon: '📊', title: 'Dashboard de Performance', desc: 'Veja em tempo real quem concluiu, quem está atrasado e a taxa de certificação da sua equipe.' },
              { icon: '🔗', title: 'Convite por Link', desc: 'Gere um link e compartilhe no WhatsApp. O vendedor clica, cria conta e já entra na sua empresa automaticamente.' },
              { icon: '🎯', title: 'Metas por Vendedor', desc: 'Acompanhe o progresso individual de cada vendedor nas trilhas e identifique quem precisa de suporte.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className="how-bg">
        <div className="section-inner">
          <p className="section-tag">Como funciona</p>
          <h2>Do cadastro à <span className="red">certificação em minutos</span></h2>
          <div className="steps">
            {[
              { n: '1', title: 'Crie sua empresa', desc: 'Cadastre-se, crie sua organização e configure o sistema em menos de 5 minutos.' },
              { n: '2', title: 'Monte trilhas', desc: 'Crie cursos com módulos sobre seus produtos. Use a IA para gerar quizzes automaticamente.' },
              { n: '3', title: 'Convide o time', desc: 'Gere um link de convite e mande no WhatsApp. O vendedor entra com um clique.' },
              { n: '4', title: 'Acompanhe tudo', desc: 'Dashboard em tempo real mostra quem está pronto para vender e quem precisa de reforço.' },
            ].map((s) => (
              <div key={s.n} className="step">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section>
        <div className="section-inner">
          <div className="preview-wrap">
            <div className="preview-text">
              <p className="section-tag">Dashboard</p>
              <h2>Visão completa do seu <span className="red">time comercial</span></h2>
              <div className="preview-list">
                {[
                  { t: 'Taxa de conclusão em tempo real', d: '— saiba exatamente o % do time que completou cada trilha.' },
                  { t: 'Ranking de vendedores', d: '— quem mais acertou nos quizzes aparece no topo automaticamente.' },
                  { t: 'Alertas de atraso', d: '— identifique quem está atrasado antes que vire problema.' },
                  { t: 'Relatórios exportáveis', d: '— leve os dados para qualquer reunião de performance.' },
                ].map((item) => (
                  <div key={item.t} className="preview-item">
                    <div className="preview-bullet">✓</div>
                    <p className="preview-item-text"><strong>{item.t}</strong> {item.d}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="dashboard-mock">
              <div className="mock-header">
                <span className="mock-title">Visão Geral — Abril 2026</span>
                <span className="mock-badge">● Ao vivo</span>
              </div>
              <div className="mock-cards">
                {[
                  { label: 'vendedores ativos', val: '24', cls: '' },
                  { label: 'taxa de conclusão', val: '87%', cls: 'green' },
                  { label: 'trilhas publicadas', val: '6', cls: '' },
                  { label: 'sem certificação', val: '3', cls: 'red' },
                ].map((c) => (
                  <div key={c.label} className="mock-card">
                    <div className="mock-card-label">{c.label}</div>
                    <div className={`mock-card-val ${c.cls}`}>{c.val}</div>
                  </div>
                ))}
              </div>
              <div className="mock-bar-title">Ranking de vendedores</div>
              <div className="mock-bars">
                {[
                  { name: 'Ana Paula', pct: 95 },
                  { name: 'Carlos M.', pct: 88 },
                  { name: 'Fernanda S.', pct: 76 },
                  { name: 'João Pedro', pct: 61 },
                ].map((b) => (
                  <div key={b.name} className="mock-bar-row">
                    <span className="mock-bar-name">{b.name}</span>
                    <div className="mock-bar-track"><div className="mock-bar-fill" style={{ width: `${b.pct}%` }}></div></div>
                    <span className="mock-bar-pct">{b.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-bg">
        <div className="section-inner">
          <p className="section-tag">Depoimentos</p>
          <h2>Quem usa <span className="red">recomenda</span></h2>
          <div className="testimonials-grid">
            {[
              { initials: 'MR', name: 'Marcos Ribeiro', role: 'Gerente Comercial · Autorizada Claro', text: '"Antes levávamos 3 semanas para treinar um vendedor novo. Com o CorpSales Academy, em 3 dias ele já estava certificado e pronto para vender."' },
              { initials: 'AP', name: 'Ana Paula Torres', role: 'Diretora de Vendas · Distribuidora TIM', text: '"O ranking de quizzes mudou tudo. Os vendedores competem para ser o primeiro do ranking e acabam revisando o conteúdo por conta própria."' },
              { initials: 'LS', name: 'Luciana Souza', role: 'CEO · Revendedora Vivo', text: '"Simples de usar, em português, e o gestor consegue criar o treinamento sozinho. Não precisamos de nenhum suporte técnico para começar."' },
            ].map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{t.initials}</div>
                  <div>
                    <div className="author-name">{t.name}</div>
                    <div className="author-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos">
        <div className="section-inner">
          <p className="section-tag">Planos</p>
          <h2>Simples e <span className="red">sem surpresas</span></h2>
          <p className="section-sub">Sem contratos longos. Cancele quando quiser.</p>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="pricing-plan">Starter</div>
              <div className="pricing-price">R$197<span>/mês</span></div>
              <div className="pricing-period">até 20 vendedores</div>
              <ul className="pricing-features">
                {['Trilhas ilimitadas', 'Quizzes manuais', 'Link de convite', 'Dashboard básico', 'Certificação automática'].map(f => <li key={f}>{f}</li>)}
              </ul>
              <a href="/sign-up" className="btn-outline">Começar grátis</a>
            </div>
            <div className="pricing-card featured">
              <div className="pricing-popular">Mais popular</div>
              <div className="pricing-plan">Pro</div>
              <div className="pricing-price">R$497<span>/mês</span></div>
              <div className="pricing-period">até 100 vendedores</div>
              <ul className="pricing-features">
                {['Tudo do Starter', 'Quiz com IA incluído', 'Ranking entre vendedores', 'Relatórios avançados', 'Metas por vendedor', 'Suporte prioritário'].map(f => <li key={f}>{f}</li>)}
              </ul>
              <a href="/sign-up" className="btn-outline">Começar grátis</a>
            </div>
            <div className="pricing-card">
              <div className="pricing-plan">Enterprise</div>
              <div className="pricing-price">R$997<span>/mês</span></div>
              <div className="pricing-period">vendedores ilimitados</div>
              <ul className="pricing-features">
                {['Tudo do Pro', 'White-label', 'Múltiplas filiais', 'API e integrações', 'Gerente de sucesso dedicado', 'SLA garantido'].map(f => <li key={f}>{f}</li>)}
              </ul>
              <a href="/sign-up" className="btn-outline">Falar com vendas</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <p className="section-tag" style={{ marginBottom: 16 }}>Pronto para começar?</p>
        <h2>Seu time merece um <span className="red">treinamento de verdade</span></h2>
        <p style={{ fontSize: 17, color: 'var(--gray-light)', marginBottom: 40, fontWeight: 300 }}>30 dias grátis. Sem cartão de crédito. Configure em 5 minutos.</p>
        <a href="/sign-up" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>Criar conta grátis →</a>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div>
            <div className="logo" style={{ marginBottom: 8 }}>
              <div className="logo-icon">CS</div>
              CorpSales Academy
            </div>
            <p className="footer-copy">© 2026 CorpSales Academy. Todos os direitos reservados.</p>
          </div>
          <div className="footer-links">
            <a href="#">Funcionalidades</a>
            <a href="#">Planos</a>
            <a href="#">Suporte</a>
            <a href="/sign-in">Entrar</a>
          </div>
        </div>
      </footer>
    </>
  )
}