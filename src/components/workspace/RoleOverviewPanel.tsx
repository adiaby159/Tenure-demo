// Role overview panel (§8.1) — navy banner with JD scope + duty rows.
export default function RoleOverviewPanel({
  scope,
  duties,
  roleLabel,
}: {
  scope: string
  duties: { label: string; detail: string }[]
  roleLabel: string
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--color-navy)' }}>
      <div className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'var(--color-brass)' }}>
          Role scope — {roleLabel}
        </p>
        <p className="text-sm text-white leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
          {scope}
        </p>
      </div>
      <div className="px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Key responsibilities
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {duties.map((d) => (
            <div
              key={d.label}
              className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--color-brass)' }}>{d.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{d.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
