'use client'

import { useState } from 'react'
import { CardType, Visibility } from '@prisma/client'
import CardModal from './CardModal'

type CardData = {
  id: string
  type: CardType
  title: string
  summary: string | null
  fields: unknown
  visibility: Visibility
  createdAt: Date
  createdBy: { name: string; avatarInitials: string }
}

const TYPE_COLORS: Record<CardType, string> = {
  charter: '#0E7490',
  contact: '#7C3AED',
  playbook: '#059669',
  budget: '#D97706',
  lesson: '#DC2626',
  thread: '#2563EB',
  sponsor: '#C9A227',
  vendor: '#059669',
  minutes: '#7C3AED',
  project: '#0E7490',
  eval: '#D97706',
}

const TYPE_LABELS: Record<CardType, string> = {
  charter: 'Charter',
  contact: 'Contact',
  playbook: 'Playbook',
  budget: 'Budget',
  lesson: 'Lesson',
  thread: 'Thread',
  sponsor: 'Sponsor',
  vendor: 'Vendor',
  minutes: 'Minutes',
  project: 'Project',
  eval: 'Evaluation',
}

const ALL_TYPES = Object.keys(TYPE_LABELS) as CardType[]

export default function CardBoard({
  cards,
  roleKey,
  canWrite,
  clubId,
  roleId,
}: {
  cards: CardData[]
  roleKey: string
  canWrite: boolean
  clubId: string
  roleId: string
}) {
  const [filter, setFilter] = useState<CardType | null>(null)
  const [selected, setSelected] = useState<CardData | null>(null)

  const presentTypes = [...new Set(cards.map((c) => c.type))]
  const filtered = filter ? cards.filter((c) => c.type === filter) : cards

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold" style={{ color: 'var(--color-navy)', fontFamily: 'var(--font-display)' }}>
          Knowledge cards
        </h2>
        {canWrite && (
          <button
            className="text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            style={{ background: 'var(--color-navy)', color: 'white' }}
          >
            + Add card
          </button>
        )}
      </div>

      {/* Filter chips */}
      {presentTypes.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilter(null)}
            className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{
              background: filter === null ? 'var(--color-navy)' : 'rgba(31,56,100,0.08)',
              color: filter === null ? 'white' : 'var(--color-navy)',
            }}
          >
            All ({cards.length})
          </button>
          {presentTypes.map((t) => (
            <button
              key={t}
              onClick={() => setFilter(filter === t ? null : t)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-colors"
              style={{
                background: filter === t ? TYPE_COLORS[t] : `${TYPE_COLORS[t]}18`,
                color: filter === t ? 'white' : TYPE_COLORS[t],
              }}
            >
              {TYPE_LABELS[t]} ({cards.filter((c) => c.type === t).length})
            </button>
          ))}
        </div>
      )}

      {/* Card board — masonry-style grid */}
      {filtered.length === 0 ? (
        <div
          className="rounded-2xl px-8 py-12 text-center"
          style={{ background: 'rgba(31,56,100,0.04)', border: '2px dashed rgba(31,56,100,0.12)' }}
        >
          <p className="text-sm" style={{ color: 'rgba(43,43,51,0.45)' }}>
            No {filter ? TYPE_LABELS[filter].toLowerCase() : ''} cards yet.
            {canWrite ? ' Add the first one.' : ''}
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((card) => (
            <div
              key={card.id}
              className="break-inside-avoid rounded-xl p-5 cursor-pointer transition-shadow hover:shadow-md"
              style={{ background: 'white', border: `1px solid ${TYPE_COLORS[card.type]}22` }}
              onClick={() => setSelected(card)}
            >
              {/* Type badge */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: `${TYPE_COLORS[card.type]}18`, color: TYPE_COLORS[card.type] }}
                >
                  {TYPE_LABELS[card.type]}
                </span>
                <span className="text-xs ml-auto" style={{ color: 'rgba(43,43,51,0.35)' }}>
                  {card.visibility === 'role' ? 'Role only' : card.visibility === 'club' ? 'Board' : 'Global'}
                </span>
              </div>

              <h3 className="font-semibold text-sm mb-1.5 leading-snug" style={{ color: 'var(--color-ink)' }}>
                {card.title}
              </h3>
              {card.summary && (
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(43,43,51,0.6)' }}>
                  {card.summary}
                </p>
              )}

              {/* Footer */}
              <div className="mt-4 pt-3 flex items-center gap-2 border-t" style={{ borderColor: 'rgba(43,43,51,0.07)' }}>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'var(--color-brass)', color: 'var(--color-navy-deep)', fontSize: '9px' }}
                >
                  {card.createdBy.avatarInitials}
                </span>
                <span className="text-xs" style={{ color: 'rgba(43,43,51,0.4)' }}>
                  {new Date(card.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Card detail modal */}
      {selected && (
        <CardModal card={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
