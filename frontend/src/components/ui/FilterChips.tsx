import { cn } from '../../lib/cn'

type FilterChipsProps<T extends string> = {
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      className={cn('flex flex-wrap gap-1.5', className)}
      role="group"
      aria-label="Filter"
    >
      {options.map((option) => {
        const active = option === value
        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              active
                ? 'bg-ink text-white'
                : 'border border-line text-muted hover:border-brand hover:text-brand-deep',
            )}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}
