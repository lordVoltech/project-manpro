import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card } from './Card'

export type StatTone = 'brand' | 'success' | 'danger' | 'neutral'

const toneClasses: Record<StatTone, string> = {
  brand: 'bg-brand/10 text-brand-deep',
  success: 'bg-emerald-50 text-emerald-700',
  danger: 'bg-red-50 text-red-700',
  neutral: 'bg-stone-100 text-stone-700',
}

export type StatCardProps = {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: StatTone
  className?: string
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = 'brand',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
            {label}
          </p>
          <p className="mt-2 truncate font-display text-2xl text-ink">
            {value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted">{hint}</p> : null}
        </div>
        <span className={cn('shrink-0 rounded-control p-2', toneClasses[tone])}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  )
}
