import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-card border border-line bg-surface shadow-[0_1px_0_rgba(45,49,48,0.04)]',
        className,
      )}
      {...props}
    />
  )
}

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-line px-5 py-4',
        className,
      )}
      {...props}
    />
  )
}

export function CardBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5', className)} {...props} />
}
