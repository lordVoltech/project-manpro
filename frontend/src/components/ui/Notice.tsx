import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Info,
  X,
  type LucideIcon,
} from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

export type NoticeTone = 'success' | 'info' | 'warning' | 'danger'

const toneConfig: Record<
  NoticeTone,
  { icon: LucideIcon; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  },
  info: {
    icon: Info,
    classes: 'border-sky-200 bg-sky-50 text-sky-900',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-amber-200 bg-amber-50 text-amber-900',
  },
  danger: {
    icon: CircleAlert,
    classes: 'border-red-200 bg-red-50 text-red-900',
  },
}

type NoticeProps = {
  tone?: NoticeTone
  children: ReactNode
  onDismiss?: () => void
  className?: string
}

export function Notice({
  tone = 'success',
  children,
  onDismiss,
  className,
}: NoticeProps) {
  const { icon: Icon, classes } = toneConfig[tone]

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 rounded-card border px-4 py-3',
        classes,
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="flex-1 text-xs leading-relaxed">{children}</div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
          aria-label="Tutup pemberitahuan"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  )
}
