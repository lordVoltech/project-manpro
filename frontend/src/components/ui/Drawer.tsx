import { X } from 'lucide-react'
import { useEffect, useId, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

type DrawerProps = {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  widthClassName?: string
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  widthClassName = 'sm:max-w-lg',
}: DrawerProps) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60]"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        className="absolute inset-0 animate-[fade-in_150ms_ease-out] bg-ink/40 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Tutup panel"
      />

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex max-h-[92svh] animate-[panel-up_200ms_ease-out] flex-col rounded-t-2xl border border-line bg-surface shadow-2xl',
          'sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:animate-[panel-right_200ms_ease-out] sm:rounded-l-2xl sm:rounded-t-none sm:border-l sm:border-t-0',
          widthClassName,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-lg text-ink">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-xs text-muted">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            className="shrink-0 rounded-control p-1.5 text-muted transition-colors hover:bg-canvas hover:text-ink"
            aria-label="Tutup panel"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <div className="border-t border-line px-5 py-4">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
