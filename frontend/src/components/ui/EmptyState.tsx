import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-canvas/60 px-6 py-12 text-center">
      <span className="rounded-full bg-brand/10 p-3 text-brand-deep">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 font-display text-lg text-ink">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
