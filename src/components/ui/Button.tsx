import { type ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'invert' | 'outline-invert'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-charcoal text-cream hover:bg-charcoal/90 shadow-soft',
  secondary:
    'bg-blush text-charcoal hover:bg-blush-dark shadow-soft',
  outline:
    'border border-gold text-charcoal hover:bg-gold/10',
  ghost: 'text-charcoal hover:bg-blush-light',
  // For use on dark/charcoal surfaces (hero, testimonials) where the
  // light-on-dark `primary`/`outline` pairing would go invisible.
  invert: 'bg-gold text-charcoal hover:bg-gold-light shadow-gold',
  'outline-invert': 'border border-cream/40 text-cream hover:bg-cream/10',
}

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base px-6 py-3',
  lg: 'text-lg px-8 py-4',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  ),
)
Button.displayName = 'Button'
