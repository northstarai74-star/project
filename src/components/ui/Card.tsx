import { type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-blush-light bg-white/70 shadow-soft backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}
