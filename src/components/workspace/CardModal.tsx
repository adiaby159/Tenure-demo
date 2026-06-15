'use client'

import { CardType, Visibility } from '@prisma/client'
import { useEffect } from 'react'

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

const FIELD_LABELS: Record<string, string> = {
  mission: 'Mission',
  goals: 'Goals',
  realScope: 'Real scope',
  timeCommitment: 'Time commitment',
  keyCounterparts: 'Key counterparts',
  whyThisCardExists: 'Why this card exists',
  name: 'Name',
  roleTitle: 'Role / title',
  email: 'Email',
  howToEngage: 'How to engage',
  relationshipHistory: 'Relationship history',
  requiredCadence: 'Required cadence',
  status: 'Status',
  owner: 'Owner',
  counterpart: 'Counterpart',
  nextStep: 'Next step',
  whyItMatters: 'Why it matters',
  jdReference: 'JD reference',
  sourceData: 'Source data',
  due: 'Due date',
  lesson: 'Lesson',
  evidence: 'Evidence',
  action: 'Action for successor',
  timing: 'Timing',
  simonSourceWindow: 'SimonSource window',
  budgetBreakdown: 'Budget breakdown',
  judgesSpeakers: 'Judges / speakers',
  cohost: 'Co-host',
  whatWorked: 'What worked',
  whatFailed: 'What failed',
  partnershipCredit: 'Partnership credit',
}

export default function CardModal({ card, onClose }: { card: CardData; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const fields = card.fields as Record<string, unknown>
  const accentColor = TYPE_COLORS[card.type]

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-6 pt-16 overflow-auto"
      style={{ background: 'rgba(22,41,74,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'white' }}
      >
        {/* Header */}
        <div className="px-6 py-5" style={{ background: accentColor }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
                {TYPE_LABELS[card.type]}
              </span>
              <h2 className="text-xl font-bold text-white mt-1 leading-snug" style={{ fontFamily: 'var(--font-display)' }}>
                {card.title}
              </h2>
              {card.summary && (
                <p className="mt-1.5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
                  {card.summary}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 flex items-center gap-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center font-bold"
              style={{ background: 'rgba(255,255,255,0.2)', fontSize: '9px' }}
            >
              {card.createdBy.avatarInitials}
            </span>
            <span>{card.createdBy.name}</span>
            <span>·</span>
            <span>{new Date(card.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span>·</span>
            <span>{card.visibility === 'role' ? 'Role only' : card.visibility === 'club' ? 'Board' : 'Global'}</span>
          </div>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-auto">
          {Object.entries(fields).map(([key, value]) => {
            if (!value || (Array.isArray(value) && value.length === 0)) return null
            const label = FIELD_LABELS[key] ?? key
            return (
              <div key={key}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: accentColor }}>
                  {label}
                </p>
                {Array.isArray(value) ? (
                  <ul className="space-y-1">
                    {(value as string[]).map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-ink)' }}>
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink)' }}>
                    {String(value)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
