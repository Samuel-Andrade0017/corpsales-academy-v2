import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getInitials, calcCompletionRate } from '@/lib/utils'
import Link from 'next/link'
import { BookOpen, Trophy, CheckCircle, Play, Star } from 'lucide-react'

export default async function MinhaAreaPage() {
  const { userId } = auth()
  if (!userId) redirect('/sign-in')

  const dbUser = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      company: true,
      enrollments: {
        include: {
          course: {
            include: {
              modules: { include: { quiz: { include: { questions: true } } } },
            },
          },
        },
      },
      certifications: { where: { passed: true } },
    },
  })

  if (!dbUser) redirect('/api/seed-company')
  if (dbUser.role !== 'EMPLOYEE') redirect('/dashboard')

  const company = dbUser.company

  const courses = await db.course.findMany({
    where: { companyId: company.id, isPublished: true },
    include: {
      modules: true,
      enrollments: { where: { userId: dbUser.id } },
      _count: { select: { enrollments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const allUsers = await db.user.findMany({
    where: { companyId: company.id, role: 'EMPLOYEE' },
    include: {
      enrollments: { where: { completedAt: { not: null } } },
      certifications: { where: { passed: true } },
    },
    orderBy: { name: 'asc' },
  })

  const totalCourses = courses.length

  const ranking = allUsers
    .map(u => ({
      id: u.id,
      name: u.name,
      completed: u.enrollments.length,
      certs: u.certifications.length,
      pct: calcCompletionRate(u.enrollments.length, totalCourses || 1),
    }))
    .sort((a, b) => b.pct - a.pct)

  const myRank = ranking.findIndex(r => r.id === dbUser.id) + 1
  const myProgress = calcCompletionRate(
    dbUser.enrollments.filter(e => e.completedAt).length,
    totalCourses || 1
  )

  const inProgress = courses.filter(c => {
    const e = c.enrollments[0]
    return e && !e.completedAt
  })

  const notStarted = courses.filter(c => c.enrollments.length === 0)
  const completed = courses.filter(c => c.enrollments[0]?.completedAt)

  const bgColors = [
    'from-red-900 to-red-700',
    'from-blue-900 to-blue-700',
    'from-purple-900 to-purple-700',
    'from-green-900 to-green-700',
    'from-orange-900 to-orange-700',
    'from-pink-900 to-pink-700',
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a', color: '#fff' }}>

      {/* NAV */}
      <nav style={{ background: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: '#E3001B', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>CS</div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>{company.name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>seu progresso</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: '#E3001B', lineHeight: 1 }}>{myProgress}%</p>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(227,0,27,0.15)', border: '2px solid #E3001B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#E3001B' }}>
            {getInitials(dbUser.name)}
          </div>
        </div>
      </nav>

      {/* HERO BANNER */}
      <div style={{ background: 'linear-gradient(135deg, #1a0000 0%, #0a0a0a 60%)', padding: '48px 40px 40px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#E3001B', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 8 }}>Bem-vindo de volta</p>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 800, marginBottom: 32, letterSpacing: '-1px' }}>
            Olá, {dbUser.name.split(' ')[0]}! 👋
          </h1>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 480 }}>
            {[
              { icon: '📚', val: courses.length, label: 'trilhas disponíveis' },
              { icon: '✅', val: completed.length, label: 'concluídas' },
              { icon: '🏆', val: `#${myRank}`, label: 'no ranking' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 40px' }}>

        {/* EM ANDAMENTO */}
        {inProgress.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Play style={{ width: 18, height: 18, color: '#E3001B' }} />
              Continuar assistindo
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {inProgress.map((course, idx) => {
                const progress = calcCompletionRate(course.enrollments[0]?.progress || 0, course.modules.length || 1)
                return (
                  <Link key={course.id} href={`/minha-area/curso/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(227,0,27,0.5)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                    >
                      {/* Thumbnail */}
                      <div style={{ height: 140, background: `linear-gradient(135deg, ${bgColors[idx % bgColors.length].replace('from-', '').replace(' to-', ', ').split(' ')[0]} 0%, ${bgColors[idx % bgColors.length].split(' ')[2]} 100%)`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        className={`bg-gradient-to-br ${bgColors[idx % bgColors.length]}`}
                      >
                        <BookOpen style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.3)' }} />
                        <div style={{ position: 'absolute', top: 10, right: 10, background: '#E3001B', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                          Em andamento
                        </div>
                        {/* Progress bar */}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(0,0,0,0.5)' }}>
                          <div style={{ height: '100%', background: '#E3001B', width: `${progress}%` }} />
                        </div>
                      </div>
                      <div style={{ padding: '14px 16px', background: '#111' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{course.title}</h3>
                        <p style={{ fontSize: 12, color: '#888' }}>{course.modules.length} módulos · {progress}% concluído</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* NÃO INICIADAS */}
        {notStarted.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Star style={{ width: 18, height: 18, color: '#f59e0b' }} />
              Trilhas disponíveis
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {notStarted.map((course, idx) => (
                <Link key={course.id} href={`/minha-area/curso/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.2s, border-color 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(227,0,27,0.5)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
                  >
                    <div style={{ height: 140, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      className={`bg-gradient-to-br ${bgColors[(idx + 2) % bgColors.length]}`}
                    >
                      <BookOpen style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.3)' }} />
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Play style={{ width: 20, height: 20, color: '#fff', marginLeft: 3 }} />
                        </div>
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px', background: '#111' }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{course.title}</h3>
                      <p style={{ fontSize: 12, color: '#888' }}>{course.modules.length} módulos · Não iniciada</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CONCLUÍDAS */}
        {completed.length > 0 && (
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <CheckCircle style={{ width: 18, height: 18, color: '#22c55e' }} />
              Trilhas concluídas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {completed.map((course, idx) => (
                <Link key={course.id} href={`/minha-area/curso/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(34,197,94,0.2)', opacity: 0.8 }}>
                    <div style={{ height: 140, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      className={`bg-gradient-to-br ${bgColors[(idx + 4) % bgColors.length]}`}
                    >
                      <BookOpen style={{ width: 40, height: 40, color: 'rgba(255,255,255,0.3)' }} />
                      <div style={{ position: 'absolute', top: 10, right: 10, background: '#22c55e', borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 600 }}>
                        ✓ Concluída
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#22c55e' }} />
                    </div>
                    <div style={{ padding: '14px 16px', background: '#111' }}>
                      <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{course.title}</h3>
                      <p style={{ fontSize: 12, color: '#888' }}>{course.modules.length} módulos · 100% concluído</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {courses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>
            <BookOpen style={{ width: 48, height: 48, color: '#444', margin: '0 auto 16px' }} />
            <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Nenhuma trilha disponível ainda</p>
            <p style={{ fontSize: 14, color: '#888' }}>Seu gestor ainda não publicou nenhuma trilha.</p>
          </div>
        )}

        {/* RANKING */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>🏆 Ranking da equipe</h2>

          {/* Top 3 */}
          {ranking.length >= 3 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[ranking[1], ranking[0], ranking[2]].map((r, i) => {
                const pos = i === 0 ? 2 : i === 1 ? 1 : 3
                const medals = ['🥈', '🥇', '🥉']
                const sizes = ['80px', '96px', '80px']
                const isMe = r?.id === dbUser.id
                return r ? (
                  <div key={r.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{medals[i]}</div>
                    <div style={{
                      width: sizes[i], height: sizes[i], borderRadius: '50%',
                      background: isMe ? 'rgba(227,0,27,0.2)' : 'rgba(255,255,255,0.05)',
                      border: isMe ? '3px solid #E3001B' : `3px solid ${i === 1 ? '#f59e0b' : i === 0 ? '#9ca3af' : '#cd7c2f'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: i === 1 ? 20 : 16, fontWeight: 800,
                      color: isMe ? '#E3001B' : '#fff', marginBottom: 8,
                    }}>
                      {getInitials(r.name)}
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.name.split(' ')[0]} {isMe && '(você)'}</p>
                    <p style={{ fontSize: 11, color: '#888' }}>{r.pct}%</p>
                  </div>
                ) : <div key={i} />
              })}
            </div>
          )}

          {/* Lista completa */}
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            {ranking.map((r, i) => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: i < ranking.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                background: r.id === dbUser.id ? 'rgba(227,0,27,0.08)' : 'transparent',
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : 'rgba(255,255,255,0.08)',
                  color: i < 3 ? '#000' : '#888',
                }}>
                  {i + 1}
                </div>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: r.id === dbUser.id ? 'rgba(227,0,27,0.2)' : 'rgba(255,255,255,0.05)',
                  border: r.id === dbUser.id ? '2px solid #E3001B' : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  color: r.id === dbUser.id ? '#E3001B' : '#888',
                }}>
                  {getInitials(r.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: r.id === dbUser.id ? '#E3001B' : '#fff' }}>
                    {r.name} {r.id === dbUser.id && <span style={{ fontSize: 11, opacity: 0.7 }}>(você)</span>}
                  </p>
                  <p style={{ fontSize: 11, color: '#666' }}>{r.completed} trilhas concluídas</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: r.id === dbUser.id ? '#E3001B' : '#555', borderRadius: 99, width: `${r.pct}%` }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#888', width: 32, textAlign: 'right' }}>{r.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}