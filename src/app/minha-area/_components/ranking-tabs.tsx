'use client'

import { useState } from 'react'

type RankItem = {
  id: string
  name: string
  completed: number
  total?: number
  pct: number
}

function getInitials(name: string) {
  return name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?'
}

export function RankingTabs({ ranking, quizRanking, scoreRanking, myId }: {
  ranking: RankItem[]
  quizRanking: RankItem[]
  scoreRanking: RankItem[]
  myId: string
}) {
  const [tab, setTab] = useState(0)
  const tabs = ['📚 Trilhas', '🎯 Quiz concluídos', '⭐ Pontuação quiz']
  const lists = [ranking, quizRanking, scoreRanking]
  const labels = [
    (r: RankItem) => `${r.completed} trilhas concluídas · ${r.pct}%`,
    (r: RankItem) => `${r.completed} acertos no quiz`,
    (r: RankItem) => `${r.completed}/${r.total ?? 0} corretas · ${r.pct}%`,
  ]
  const values = [
    (r: RankItem) => `${r.pct}%`,
    (r: RankItem) => `${r.completed}`,
    (r: RankItem) => `${r.pct}%`,
  ]
  const current = lists[tab]

  return (
    <>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: tab === i ? '#E3001B' : 'rgba(255,255,255,0.08)', color: tab === i ? '#fff' : '#888', transition: 'all 0.2s' }}>
            {t}
          </button>
        ))}
      </div>

      {current.length >= 3 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20, background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '24px 16px' }}>
          {[current[1], current[0], current[2]].map((r, i) => {
            const medals = ['🥈', '🥇', '🥉']
            const sizes = [72, 88, 72]
            const isMe = r?.id === myId
            const borderColors = ['#9ca3af', '#f59e0b', '#cd7c2f']
            return r ? (
              <div key={r.id} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{medals[i]}</div>
                <div style={{ width: sizes[i], height: sizes[i], borderRadius: '50%', background: isMe ? 'rgba(227,0,27,0.15)' : 'rgba(255,255,255,0.05)', border: `3px solid ${isMe ? '#E3001B' : borderColors[i]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 1 ? 20 : 16, fontWeight: 800, color: isMe ? '#E3001B' : '#fff', marginBottom: 8 }}>
                  {getInitials(r.name)}
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{r.name?.split(' ')[0]} {isMe && <span style={{ color: '#E3001B' }}>(você)</span>}</p>
                <p style={{ fontSize: 11, color: '#888' }}>{values[tab](r)}</p>
              </div>
            ) : <div key={i} />
          })}
        </div>
      )}

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
        {current.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '32px', color: '#666', fontSize: 14 }}>Nenhum dado ainda.</p>
        ) : current.map((r, i) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < current.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', background: r.id === myId ? 'rgba(227,0,27,0.08)' : 'transparent' }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, background: i === 0 ? '#f59e0b' : i === 1 ? '#9ca3af' : i === 2 ? '#cd7c2f' : 'rgba(255,255,255,0.08)', color: i < 3 ? '#000' : '#888' }}>
              {i + 1}
            </div>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: r.id === myId ? 'rgba(227,0,27,0.2)' : 'rgba(255,255,255,0.05)', border: r.id === myId ? '2px solid #E3001B' : '2px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: r.id === myId ? '#E3001B' : '#888' }}>
              {getInitials(r.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: r.id === myId ? '#E3001B' : '#fff' }}>
                {r.name} {r.id === myId && <span style={{ fontSize: 11, opacity: 0.7 }}>(você)</span>}
              </p>
              <p style={{ fontSize: 11, color: '#666' }}>{labels[tab](r)}</p>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#888', flexShrink: 0 }}>{values[tab](r)}</span>
          </div>
        ))}
      </div>
    </>
  )
}