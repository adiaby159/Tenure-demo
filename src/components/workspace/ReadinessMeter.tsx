// Handoff-readiness meter (§8.1/§8.8) — brass bar + percentage.
// Simple N-of-M required cards present. No configurable rules engine in v1.
export default function ReadinessMeter({
  pct,
  present,
  total,
}: {
  pct: number
  present: number
  total: number
}) {
  const color = pct >= 80 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626'

  return (
    <div className="flex-shrink-0 text-right min-w-[140px]">
      <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'rgba(43,43,51,0.45)' }}>
        Handoff readiness
      </p>
      <p className="text-3xl font-bold" style={{ color, fontFamily: 'var(--font-display)' }}>
        {pct}%
      </p>
      <p className="text-xs mt-0.5" style={{ color: 'rgba(43,43,51,0.5)' }}>
        {present} of {total} required cards
      </p>
      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(43,43,51,0.12)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  )
}
