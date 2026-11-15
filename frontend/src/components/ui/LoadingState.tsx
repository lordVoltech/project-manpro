import { LoaderCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

type LoadingStateProps = {
  label?: string
  className?: string
}

export function LoadingState({
  label = 'Memuat data…',
  className,
}: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center justify-center gap-2 px-5 py-10 text-sm text-muted',
        className,
      )}
    >
      <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
      {label}
    </div>
  )
}
