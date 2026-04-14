# Claro Treina — Plataforma de Treinamento para Autorizadas

LMS B2B focado em operadoras autorizadas. Certifique vendedores por linha de produto, acompanhe progresso e aumente as vendas da sua equipe.

---

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Auth**: Clerk (multi-tenant por organização)
- **Banco**: PostgreSQL via Prisma ORM
- **Deploy frontend**: Vercel
- **Deploy backend/banco**: Railway
- **Pagamentos**: Stripe
- **E-mail**: Resend

---

## Setup local (passo a passo)

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Abra `.env.local` e preencha:

| Variável | Onde pegar |
|---|---|
| `DATABASE_URL` | Railway → seu projeto → PostgreSQL → Connect |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | clerk.com → seu app → API Keys |
| `CLERK_SECRET_KEY` | clerk.com → seu app → API Keys |
| `CLERK_WEBHOOK_SECRET` | clerk.com → Webhooks → seu endpoint |
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | dashboard.stripe.com → Webhooks |
| `RESEND_API_KEY` | resend.com → API Keys |

### 3. Configure o banco de dados

```bash
npm run db:push      # cria as tabelas no banco
npm run db:generate  # gera o client do Prisma
```

### 4. Rode o projeto

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

---

## Configurar o Clerk

1. Crie uma conta em [clerk.com](https://clerk.com)
2. Crie um novo aplicativo
3. Em **Organizations**, ative a funcionalidade
4. Configure os webhooks:
   - URL: `https://seu-dominio.vercel.app/api/webhooks/clerk`
   - Eventos: `organization.created`, `organizationMembership.created`
5. Copie as chaves para o `.env.local`

---

## Configurar o Railway

1. Crie uma conta em [railway.app](https://railway.app)
2. Crie um novo projeto → Add PostgreSQL
3. Copie a `DATABASE_URL` nas configurações
4. Cole no `.env.local`

---

## Deploy no Vercel

```bash
# Instale o CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel --prod
```

Configure as variáveis de ambiente no painel do Vercel (Settings → Environment Variables).

---

## Estrutura do projeto

```
src/
├── app/
│   ├── (auth)/          # Páginas de login e cadastro
│   ├── (dashboard)/     # App principal (protegido)
│   │   ├── dashboard/   # Visão geral
│   │   ├── courses/     # Trilhas de treinamento
│   │   ├── products/    # Linhas de produto
│   │   ├── users/       # Vendedores
│   │   └── reports/     # Relatórios
│   ├── api/             # API routes
│   └── page.tsx         # Landing page pública
├── lib/
│   ├── db.ts            # Instância do Prisma
│   └── utils.ts         # Funções utilitárias
└── middleware.ts         # Proteção de rotas
```

---

## Próximos passos após o setup

- [ ] Configurar Clerk Organizations
- [ ] Criar produtos no Stripe (Starter R$1.500/mês, Growth R$3.000/mês)
- [ ] Adicionar upload de vídeo (Mux ou Cloudflare Stream)
- [ ] Implementar geração de relatório PDF
- [ ] Configurar e-mails automáticos via Resend
