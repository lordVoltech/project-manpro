import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-white hover:bg-brand-deep focus-visible:ring-brand/40',
  secondary:
    'border border-line bg-surface text-ink hover:border-brand hover:text-brand-deep focus-visible:ring-brand/30',
  ghost:
    'text-muted hover:bg-brand/10 hover:text-brand-deep focus-visible:ring-brand/30',
  danger:
    'bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700/40',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-control font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  )
}
