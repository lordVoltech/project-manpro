import { CircleAlert, RefreshCw } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

type ErrorStateProps = {
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  message = 'Terjadi kesalahan saat menghubungi server.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center gap-3 px-5 py-10 text-center',
        className,
      )}
    >
      <CircleAlert className="h-6 w-6 text-red-600" aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-ink">Gagal memuat data</p>
        <p className="mt-1 text-xs text-muted">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Coba lagi
        </Button>
      ) : null}
    </div>
  )
}
