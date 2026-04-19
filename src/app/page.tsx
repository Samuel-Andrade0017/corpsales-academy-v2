<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CorpSales Academy — Treine. Certifique. Venda Mais.</title>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --red: #E3001B;
    --red-dark: #b5001a;
    --dark: #0a0a0a;
    --dark-2: #111111;
    --dark-3: #1a1a1a;
    --dark-4: #222222;
    --white: #ffffff;
    --gray: #888888;
    --gray-light: #cccccc;
    --border: rgba(255,255,255,0.08);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--dark);
    color: var(--white);
    overflow-x: hidden;
    line-height: 1.6;
  }

  /* NAV */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    padding: 20px 60px;
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Syne', sans-serif;
    font-weight: 800; font-size: 18px; color: var(--white);
    text-decoration: none;
  }

  .logo-icon {
    width: 32px; height: 32px; background: var(--red);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 800;
  }

  .nav-links {
    display: flex; align-items: center; gap: 32px;
    list-style: none;
  }

  .nav-links a {
    color: var(--gray-light); text-decoration: none;
    font-size: 14px; font-weight: 400;
    transition: color 0.2s;
  }

  .nav-links a:hover { color: var(--white); }

  .nav-cta {
    background: var(--red); color: var(--white) !important;
    padding: 10px 24px; border-radius: 8px;
    font-weight: 500 !important; font-size: 14px !important;
    transition: background 0.2s !important;
  }

  .nav-cta:hover { background: var(--red-dark) !important; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: 140px 60px 100px;
    position: relative;
    overflow: hidden;
  }

  .hero-bg {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(227,0,27,0.12) 0%, transparent 60%),
                radial-gradient(ellipse 40% 40% at 20% 80%, rgba(227,0,27,0.06) 0%, transparent 50%);
  }

  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 100%);
  }

  .hero-content { position: relative; z-index: 2; max-width: 700px; }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(227,0,27,0.15);
    border: 1px solid rgba(227,0,27,0.3);
    color: #ff6b6b; padding: 6px 16px; border-radius: 99px;
    font-size: 13px; font-weight: 500; margin-bottom: 32px;
  }

  .hero-badge span { width: 6px; height: 6px; background: var(--red); border-radius: 50%; display: inline-block; animation: pulse 2s infinite; }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  h1 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(48px, 6vw, 80px);
    font-weight: 800; line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 24px;
  }

  h1 em { font-style: normal; color: var(--red); }

  .hero-sub {
    font-size: 18px; color: var(--gray-light);
    max-width: 520px; line-height: 1.7; margin-bottom: 40px;
    font-weight: 300;
  }

  .hero-actions { display: flex; align-items: center; gap: 16px; }

  .btn-primary {
    background: var(--red); color: var(--white);
    padding: 14px 32px; border-radius: 10px;
    font-size: 15px; font-weight: 500;
    text-decoration: none; transition: all 0.2s;
    border: none; cursor: pointer;
  }

  .btn-primary:hover { background: var(--red-dark); transform: translateY(-1px); }

  .btn-ghost {
    color: var(--gray-light); font-size: 15px; font-weight: 400;
    text-decoration: none; display: flex; align-items: center; gap: 8px;
    transition: color 0.2s;
  }

  .btn-ghost:hover { color: var(--white); }

  /* SOCIAL PROOF */
  .social-proof {
    padding: 60px 60px;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--dark-2);
  }

  .social-proof-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; gap: 60px;
    flex-wrap: wrap;
  }

  .social-proof-label {
    font-size: 12px; color: var(--gray);
    text-transform: uppercase; letter-spacing: 0.1em;
    flex-shrink: 0;
  }

  .stats-row {
    display: flex; gap: 48px; flex-wrap: wrap;
  }

  .stat { text-align: center; }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 36px; font-weight: 800;
    color: var(--white); line-height: 1;
  }

  .stat-num span { color: var(--red); }

  .stat-label { font-size: 12px; color: var(--gray); margin-top: 4px; }

  /* SECTION */
  section { padding: 100px 60px; }

  .section-inner { max-width: 1100px; margin: 0 auto; }

  .section-tag {
    font-size: 12px; color: var(--red);
    text-transform: uppercase; letter-spacing: 0.15em;
    font-weight: 600; margin-bottom: 16px;
  }

  h2 {
    font-family: 'Syne', sans-serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -1.5px; margin-bottom: 20px;
  }

  h2 em { font-style: normal; color: var(--red); }

  .section-sub {
    font-size: 17px; color: var(--gray-light);
    max-width: 560px; font-weight: 300; line-height: 1.7;
  }

  /* FEATURES GRID */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 60px;
  }

  .feature-card {
    background: var(--dark-3);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 32px;
    transition: border-color 0.2s, transform 0.2s;
  }

  .feature-card:hover {
    border-color: rgba(227,0,27,0.3);
    transform: translateY(-4px);
  }

  .feature-icon {
    width: 44px; height: 44px;
    background: rgba(227,0,27,0.12);
    border: 1px solid rgba(227,0,27,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; margin-bottom: 20px;
  }

  .feature-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px; font-weight: 700;
    margin-bottom: 10px;
  }

  .feature-desc {
    font-size: 14px; color: var(--gray);
    line-height: 1.6;
  }

  /* HOW IT WORKS */
  .how-bg { background: var(--dark-2); }

  .steps {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 0; margin-top: 60px; position: relative;
  }

  .steps::before {
    content: '';
    position: absolute; top: 28px; left: 12.5%; right: 12.5%;
    height: 1px; background: var(--border); z-index: 0;
  }

  .step { text-align: center; padding: 0 20px; position: relative; }

  .step-num {
    width: 56px; height: 56px;
    background: var(--dark-3);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    font-family: 'Syne', sans-serif;
    font-size: 20px; font-weight: 800;
    color: var(--red); position: relative; z-index: 1;
  }

  .step-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px; font-weight: 700; margin-bottom: 8px;
  }

  .step-desc { font-size: 13px; color: var(--gray); line-height: 1.5; }

  /* DASHBOARD PREVIEW */
  .preview-wrap {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 60px; align-items: center; margin-top: 60px;
  }

  .preview-text h2 { margin-bottom: 16px; }

  .preview-list { margin-top: 32px; display: flex; flex-direction: column; gap: 16px; }

  .preview-item {
    display: flex; align-items: flex-start; gap: 14px;
  }

  .preview-bullet {
    width: 20px; height: 20px; flex-shrink: 0;
    background: rgba(227,0,27,0.15);
    border: 1px solid rgba(227,0,27,0.3);
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: var(--red); margin-top: 2px;
  }

  .preview-item-text { font-size: 15px; color: var(--gray-light); line-height: 1.5; }
  .preview-item-text strong { color: var(--white); font-weight: 500; }

  .dashboard-mock {
    background: var(--dark-3);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 24px;
    position: relative; overflow: hidden;
  }

  .dashboard-mock::before {
    content: '';
    position: absolute; top: -40px; right: -40px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(227,0,27,0.15) 0%, transparent 70%);
  }

  .mock-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }

  .mock-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; }
  .mock-badge {
    font-size: 11px; background: rgba(59,109,17,0.2);
    color: #7cb342; padding: 3px 10px; border-radius: 99px;
    border: 1px solid rgba(59,109,17,0.3);
  }

  .mock-cards {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 12px; margin-bottom: 20px;
  }

  .mock-card {
    background: var(--dark-4);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 16px;
  }

  .mock-card-label { font-size: 11px; color: var(--gray); margin-bottom: 6px; }
  .mock-card-val {
    font-family: 'Syne', sans-serif;
    font-size: 28px; font-weight: 800;
  }

  .mock-card-val.green { color: #7cb342; }
  .mock-card-val.red { color: var(--red); }

  .mock-bar-title { font-size: 12px; color: var(--gray); margin-bottom: 12px; }

  .mock-bars { display: flex; flex-direction: column; gap: 8px; }

  .mock-bar-row { display: flex; align-items: center; gap: 10px; }
  .mock-bar-name { font-size: 12px; color: var(--gray-light); width: 80px; flex-shrink: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .mock-bar-track { flex: 1; height: 6px; background: var(--dark-4); border-radius: 99px; overflow: hidden; }
  .mock-bar-fill { height: 100%; border-radius: 99px; background: var(--red); }
  .mock-bar-pct { font-size: 11px; color: var(--gray); width: 32px; text-align: right; }

  /* TESTIMONIAL */
  .testimonials-bg { background: var(--dark-2); }

  .testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 60px;
  }

  .testimonial-card {
    background: var(--dark-3);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 32px;
  }

  .testimonial-stars { color: #f59e0b; font-size: 14px; margin-bottom: 16px; }

  .testimonial-text {
    font-size: 15px; color: var(--gray-light);
    line-height: 1.7; margin-bottom: 24px;
    font-style: italic;
  }

  .testimonial-author { display: flex; align-items: center; gap: 12px; }

  .author-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--red); display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
  }

  .author-name { font-size: 14px; font-weight: 500; }
  .author-role { font-size: 12px; color: var(--gray); }

  /* PRICING */
  .pricing-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px; margin-top: 60px;
  }

  .pricing-card {
    background: var(--dark-3);
    border: 1px solid var(--border);
    border-radius: 16px; padding: 36px;
    position: relative; transition: border-color 0.2s;
  }

  .pricing-card.featured {
    border-color: var(--red);
    background: linear-gradient(135deg, rgba(227,0,27,0.08) 0%, var(--dark-3) 60%);
  }

  .pricing-popular {
    position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
    background: var(--red); color: var(--white);
    font-size: 11px; font-weight: 600;
    padding: 4px 16px; border-radius: 99px;
    white-space: nowrap;
  }

  .pricing-plan {
    font-size: 12px; color: var(--gray);
    text-transform: uppercase; letter-spacing: 0.1em;
    margin-bottom: 12px;
  }

  .pricing-price {
    font-family: 'Syne', sans-serif;
    font-size: 48px; font-weight: 800;
    margin-bottom: 4px; line-height: 1;
  }

  .pricing-price span { font-size: 18px; font-weight: 400; color: var(--gray); }

  .pricing-period { font-size: 13px; color: var(--gray); margin-bottom: 28px; }

  .pricing-features { list-style: none; margin-bottom: 32px; }

  .pricing-features li {
    display: flex; align-items: center; gap: 10px;
    font-size: 14px; color: var(--gray-light); padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }

  .pricing-features li:last-child { border-bottom: none; }

  .pricing-features li::before {
    content: '✓'; color: var(--red);
    font-weight: 700; font-size: 12px;
    flex-shrink: 0;
  }

  .btn-outline {
    display: block; text-align: center;
    border: 1px solid var(--border);
    color: var(--white); padding: 12px 24px;
    border-radius: 10px; font-size: 14px; font-weight: 500;
    text-decoration: none; transition: all 0.2s;
  }

  .btn-outline:hover { border-color: var(--red); color: var(--red); }

  .pricing-card.featured .btn-outline {
    background: var(--red); border-color: var(--red);
  }

  .pricing-card.featured .btn-outline:hover {
    background: var(--red-dark); border-color: var(--red-dark); color: var(--white);
  }

  /* CTA */
  .cta-section {
    padding: 100px 60px;
    background: linear-gradient(135deg, rgba(227,0,27,0.15) 0%, rgba(10,10,10,0) 60%);
    border-top: 1px solid var(--border);
    text-align: center;
  }

  .cta-section h2 { margin: 0 auto 20px; max-width: 600px; }

  .cta-section p {
    font-size: 17px; color: var(--gray-light);
    margin-bottom: 40px; font-weight: 300;
  }

  /* FOOTER */
  footer {
    padding: 60px;
    border-top: 1px solid var(--border);
    background: var(--dark-2);
  }

  .footer-inner {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
  }

  .footer-copy { font-size: 13px; color: var(--gray); }

  .footer-links { display: flex; gap: 24px; }

  .footer-links a {
    font-size: 13px; color: var(--gray);
    text-decoration: none; transition: color 0.2s;
  }

  .footer-links a:hover { color: var(--white); }

  /* ANIMATIONS */
  .fade-up {
    opacity: 0; transform: translateY(30px);
    animation: fadeUp 0.7s forwards;
  }

  .fade-up-d1 { animation-delay: 0.1s; }
  .fade-up-d2 { animation-delay: 0.2s; }
  .fade-up-d3 { animation-delay: 0.3s; }
  .fade-up-d4 { animation-delay: 0.4s; }

  @keyframes fadeUp {
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    nav { padding: 16px 24px; }
    .nav-links { display: none; }
    .hero { padding: 120px 24px 80px; }
    section { padding: 60px 24px; }
    .features-grid { grid-template-columns: 1fr; }
    .steps { grid-template-columns: 1fr 1fr; gap: 32px; }
    .steps::before { display: none; }
    .preview-wrap { grid-template-columns: 1fr; }
    .testimonials-grid { grid-template-columns: 1fr; }
    .pricing-grid { grid-template-columns: 1fr; }
    .social-proof { padding: 40px 24px; }
    footer { padding: 40px 24px; }
    .footer-inner { flex-direction: column; gap: 20px; text-align: center; }
  }
</style>
</head>
<body>

<!-- NAV -->
<nav>
  <a href="#" class="logo">
    <div class="logo-icon">CS</div>
    CorpSales Academy
  </a>
  <ul class="nav-links">
    <li><a href="#funcionalidades">Funcionalidades</a></li>
    <li><a href="#como-funciona">Como funciona</a></li>
    <li><a href="#planos">Planos</a></li>
    <li><a href="https://corpsales-academy.vercel.app/sign-in" class="nav-cta">Entrar</a></li>
  </ul>
</nav>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>
  <div class="hero-content">
    <div class="hero-badge fade-up fade-up-d1">
      <span></span>
      Plataforma B2B para times de vendas
    </div>
    <h1 class="fade-up fade-up-d2">
      Treine.<br>Certifique.<br><em>Venda mais.</em>
    </h1>
    <p class="hero-sub fade-up fade-up-d3">
      A plataforma que transforma sua equipe de vendas em especialistas certificados. Crie trilhas, aplique quizzes e acompanhe quem está pronto para vender.
    </p>
    <div class="hero-actions fade-up fade-up-d4">
      <a href="https://corpsales-academy.vercel.app/sign-up" class="btn-primary">Testar 30 dias grátis</a>
      <a href="#como-funciona" class="btn-ghost">Como funciona →</a>
    </div>
  </div>
</section>

<!-- SOCIAL PROOF -->
<div class="social-proof">
  <div class="social-proof-inner">
    <p class="social-proof-label">Resultados reais</p>
    <div class="stats-row">
      <div class="stat">
        <div class="stat-num">3<span>x</span></div>
        <div class="stat-label">mais rápido no onboarding</div>
      </div>
      <div class="stat">
        <div class="stat-num">87<span>%</span></div>
        <div class="stat-label">taxa de conclusão média</div>
      </div>
      <div class="stat">
        <div class="stat-num">200<span>+</span></div>
        <div class="stat-label">vendedores treinados</div>
      </div>
      <div class="stat">
        <div class="stat-num">R<span>$</span>997</div>
        <div class="stat-label">custo médio/vendedor no Brasil</div>
      </div>
    </div>
  </div>
</div>

<!-- FEATURES -->
<section id="funcionalidades">
  <div class="section-inner">
    <p class="section-tag">Funcionalidades</p>
    <h2>Tudo que você precisa<br>para <em>capacitar seu time</em></h2>
    <p class="section-sub">Diferente de LMSs genéricos, o CorpSales Academy foi construído especificamente para gestores comerciais.</p>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">📚</div>
        <div class="feature-title">Trilhas de Treinamento</div>
        <div class="feature-desc">Crie cursos com módulos sequenciais sobre seus produtos e técnicas de venda. Sem precisar de equipe de TI.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">✨</div>
        <div class="feature-title">Quiz com IA</div>
        <div class="feature-desc">Cole o conteúdo do módulo e a IA gera automaticamente 5 perguntas de múltipla escolha. Em segundos.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🏆</div>
        <div class="feature-title">Ranking e Certificação</div>
        <div class="feature-desc">Ranking de acertos entre vendedores gera competição saudável. Certificação automática ao final da trilha.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <div class="feature-title">Dashboard de Performance</div>
        <div class="feature-desc">Veja em tempo real quem concluiu, quem está atrasado e a taxa de certificação da sua equipe.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🔗</div>
        <div class="feature-title">Convite por Link</div>
        <div class="feature-desc">Gere um link e compartilhe no WhatsApp. O vendedor clica, cria conta e já entra na sua empresa automaticamente.</div>
      </div>
      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <div class="feature-title">Metas por Vendedor</div>
        <div class="feature-desc">Acompanhe o progresso individual de cada vendedor nas trilhas e identifique quem precisa de suporte.</div>
      </div>
    </div>
  </div>
</section>

<!-- HOW IT WORKS -->
<section id="como-funciona" class="how-bg">
  <div class="section-inner">
    <p class="section-tag">Como funciona</p>
    <h2>Do cadastro à<br><em>certificação em minutos</em></h2>

    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <div class="step-title">Crie sua empresa</div>
        <div class="step-desc">Cadastre-se, crie sua organização e configure o sistema em menos de 5 minutos.</div>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <div class="step-title">Monte trilhas</div>
        <div class="step-desc">Crie cursos com módulos sobre seus produtos. Use a IA para gerar quizzes automaticamente.</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <div class="step-title">Convide o time</div>
        <div class="step-desc">Gere um link de convite e mande no WhatsApp. O vendedor entra com um clique.</div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <div class="step-title">Acompanhe tudo</div>
        <div class="step-desc">Dashboard em tempo real mostra quem está pronto para vender e quem precisa de reforço.</div>
      </div>
    </div>
  </div>
</section>

<!-- DASHBOARD PREVIEW -->
<section>
  <div class="section-inner">
    <div class="preview-wrap">
      <div class="preview-text">
        <p class="section-tag">Dashboard</p>
        <h2>Visão completa<br>do seu <em>time comercial</em></h2>
        <div class="preview-list">
          <div class="preview-item">
            <div class="preview-bullet">✓</div>
            <p class="preview-item-text"><strong>Taxa de conclusão em tempo real</strong> — saiba exatamente o % do time que completou cada trilha.</p>
          </div>
          <div class="preview-item">
            <div class="preview-bullet">✓</div>
            <p class="preview-item-text"><strong>Ranking de vendedores</strong> — quem mais acertou nos quizzes aparece no topo automaticamente.</p>
          </div>
          <div class="preview-item">
            <div class="preview-bullet">✓</div>
            <p class="preview-item-text"><strong>Alertas de atraso</strong> — identifique quem está atrasado nas trilhas antes que vire problema.</p>
          </div>
          <div class="preview-item">
            <div class="preview-bullet">✓</div>
            <p class="preview-item-text"><strong>Relatórios exportáveis</strong> — leve os dados para qualquer reunião de performance.</p>
          </div>
        </div>
      </div>

      <div class="dashboard-mock">
        <div class="mock-header">
          <span class="mock-title">Visão Geral — Abril 2026</span>
          <span class="mock-badge">● Ao vivo</span>
        </div>
        <div class="mock-cards">
          <div class="mock-card">
            <div class="mock-card-label">vendedores ativos</div>
            <div class="mock-card-val">24</div>
          </div>
          <div class="mock-card">
            <div class="mock-card-label">taxa de conclusão</div>
            <div class="mock-card-val green">87%</div>
          </div>
          <div class="mock-card">
            <div class="mock-card-label">trilhas publicadas</div>
            <div class="mock-card-val">6</div>
          </div>
          <div class="mock-card">
            <div class="mock-card-label">sem certificação</div>
            <div class="mock-card-val red">3</div>
          </div>
        </div>
        <div class="mock-bar-title">Ranking de vendedores</div>
        <div class="mock-bars">
          <div class="mock-bar-row">
            <span class="mock-bar-name">Ana Paula</span>
            <div class="mock-bar-track"><div class="mock-bar-fill" style="width:95%"></div></div>
            <span class="mock-bar-pct">95%</span>
          </div>
          <div class="mock-bar-row">
            <span class="mock-bar-name">Carlos M.</span>
            <div class="mock-bar-track"><div class="mock-bar-fill" style="width:88%"></div></div>
            <span class="mock-bar-pct">88%</span>
          </div>
          <div class="mock-bar-row">
            <span class="mock-bar-name">Fernanda S.</span>
            <div class="mock-bar-track"><div class="mock-bar-fill" style="width:76%"></div></div>
            <span class="mock-bar-pct">76%</span>
          </div>
          <div class="mock-bar-row">
            <span class="mock-bar-name">João Pedro</span>
            <div class="mock-bar-track"><div class="mock-bar-fill" style="width:61%"></div></div>
            <span class="mock-bar-pct">61%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- TESTIMONIALS -->
<section class="testimonials-bg">
  <div class="section-inner">
    <p class="section-tag">Depoimentos</p>
    <h2>Quem usa <em>recomenda</em></h2>

    <div class="testimonials-grid">
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">"Antes levávamos 3 semanas para treinar um vendedor novo. Com o CorpSales Academy, em 3 dias ele já estava certificado e pronto para vender."</p>
        <div class="testimonial-author">
          <div class="author-avatar">MR</div>
          <div>
            <div class="author-name">Marcos Ribeiro</div>
            <div class="author-role">Gerente Comercial · Autorizada Claro</div>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">"O ranking de quizzes mudou tudo. Os vendedores competem para ser o primeiro do ranking e acabam revisando o conteúdo por conta própria."</p>
        <div class="testimonial-author">
          <div class="author-avatar">AP</div>
          <div>
            <div class="author-name">Ana Paula Torres</div>
            <div class="author-role">Diretora de Vendas · Distribuidora TIM</div>
          </div>
        </div>
      </div>
      <div class="testimonial-card">
        <div class="testimonial-stars">★★★★★</div>
        <p class="testimonial-text">"Simples de usar, em português, e o gestor consegue criar o treinamento sozinho. Não precisamos de nenhum suporte técnico para começar."</p>
        <div class="testimonial-author">
          <div class="author-avatar">LS</div>
          <div>
            <div class="author-name">Luciana Souza</div>
            <div class="author-role">CEO · Revendedora Vivo</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="planos">
  <div class="section-inner">
    <p class="section-tag">Planos</p>
    <h2>Simples e <em>sem surpresas</em></h2>
    <p class="section-sub">Sem contratos longos. Cancele quando quiser.</p>

    <div class="pricing-grid">
      <div class="pricing-card">
        <div class="pricing-plan">Starter</div>
        <div class="pricing-price">R$197<span>/mês</span></div>
        <div class="pricing-period">até 20 vendedores</div>
        <ul class="pricing-features">
          <li>Trilhas ilimitadas</li>
          <li>Quizzes manuais</li>
          <li>Link de convite</li>
          <li>Dashboard básico</li>
          <li>Certificação automática</li>
        </ul>
        <a href="https://corpsales-academy.vercel.app/sign-up" class="btn-outline">Começar grátis</a>
      </div>

      <div class="pricing-card featured">
        <div class="pricing-popular">Mais popular</div>
        <div class="pricing-plan">Pro</div>
        <div class="pricing-price">R$497<span>/mês</span></div>
        <div class="pricing-period">até 100 vendedores</div>
        <ul class="pricing-features">
          <li>Tudo do Starter</li>
          <li>Quiz com IA incluído</li>
          <li>Ranking entre vendedores</li>
          <li>Relatórios avançados</li>
          <li>Metas por vendedor</li>
          <li>Suporte prioritário</li>
        </ul>
        <a href="https://corpsales-academy.vercel.app/sign-up" class="btn-outline">Começar grátis</a>
      </div>

      <div class="pricing-card">
        <div class="pricing-plan">Enterprise</div>
        <div class="pricing-price">R$997<span>/mês</span></div>
        <div class="pricing-period">vendedores ilimitados</div>
        <ul class="pricing-features">
          <li>Tudo do Pro</li>
          <li>White-label</li>
          <li>Múltiplas filiais</li>
          <li>API e integrações</li>
          <li>Gerente de sucesso dedicado</li>
          <li>SLA garantido</li>
        </ul>
        <a href="https://corpsales-academy.vercel.app/sign-up" class="btn-outline">Falar com vendas</a>
      </div>
    </div>
  </div>
</section>

<!-- CTA FINAL -->
<div class="cta-section">
  <p class="section-tag" style="margin-bottom:16px">Pronto para começar?</p>
  <h2>Seu time merece um<br><em>treinamento de verdade</em></h2>
  <p>30 dias grátis. Sem cartão de crédito. Configure em 5 minutos.</p>
  <a href="https://corpsales-academy.vercel.app/sign-up" class="btn-primary" style="font-size:16px; padding:16px 40px">
    Criar conta grátis →
  </a>
</div>

<!-- FOOTER -->
<footer>
  <div class="footer-inner">
    <div>
      <div class="logo" style="margin-bottom:8px">
        <div class="logo-icon">CS</div>
        CorpSales Academy
      </div>
      <p class="footer-copy">© 2026 CorpSales Academy. Todos os direitos reservados.</p>
    </div>
    <div class="footer-links">
      <a href="#">Funcionalidades</a>
      <a href="#">Planos</a>
      <a href="#">Suporte</a>
      <a href="https://corpsales-academy.vercel.app/sign-in">Entrar</a>
    </div>
  </div>
</footer>

</body>
</html>