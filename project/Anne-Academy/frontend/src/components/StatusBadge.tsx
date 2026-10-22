const colorMap: Record<string, string> = {
  new: 'bg-forest-100 text-forest-700',
  contacted: 'bg-ochre/15 text-ochre',
  follow_up: 'bg-ochre/25 text-ochre',
  admitted: 'bg-forest-600 text-white',
  lost: 'bg-brick/10 text-brick',
  active: 'bg-forest-600 text-white',
  inactive: 'bg-ink/10 text-ink/60',
  alumni: 'bg-forest-100 text-forest-700',
  paid: 'bg-forest-600 text-white',
  pending: 'bg-ochre/20 text-ochre',
  overdue: 'bg-brick/10 text-brick',
  present: 'bg-forest-600 text-white',
  absent: 'bg-brick/10 text-brick',
  leave: 'bg-ochre/20 text-ochre',
  late: 'bg-ochre/20 text-ochre',
}

export default function StatusBadge({ status }: { status: string }) {
  const classes = colorMap[status] || 'bg-ink/10 text-ink/60'
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${classes}`}>
      {status.replace('_', ' ')}
    </span>
  )
}
