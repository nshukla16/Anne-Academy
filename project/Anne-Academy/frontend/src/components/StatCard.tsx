interface StatCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: 'forest' | 'ochre' | 'brick'
}

const accentMap = {
  forest: 'text-forest-700',
  ochre: 'text-ochre',
  brick: 'text-brick',
}

export default function StatCard({ label, value, hint, accent = 'forest' }: StatCardProps) {
  return (
    <div className="bg-white border border-forest-100 rounded-lg px-5 py-4">
      <p className="text-xs uppercase tracking-wide text-ink/50">{label}</p>
      <p className={`font-display text-3xl mt-2 ${accentMap[accent]}`}>{value}</p>
      {hint && <p className="text-xs text-ink/40 mt-1">{hint}</p>}
    </div>
  )
}
