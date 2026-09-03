import { cn } from '../../lib/utils'

interface SectionHeadingProps {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export function SectionHeading({ eyebrow, title, description, align = 'center', className }: SectionHeadingProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">
          {eyebrow}
        </p>
      )}
      <h2 className="font-serif text-3xl font-semibold text-charcoal sm:text-4xl">{title}</h2>
      <div className={cn('gold-divider mt-4', align === 'center' && 'mx-auto')} />
      {description && (
        <p className={cn('mt-4 text-charcoal/70', align === 'center' && 'mx-auto max-w-2xl')}>
          {description}
        </p>
      )}
    </div>
  )
}
