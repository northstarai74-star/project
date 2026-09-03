import { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '../../lib/utils'

const fieldClasses =
  'focus-ring w-full rounded-xl border border-blush-light bg-white px-4 py-3 text-charcoal placeholder:text-charcoal/40 disabled:opacity-60'

interface LabeledFieldProps {
  label: string
  error?: string
  id: string
}

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & LabeledFieldProps
>(({ label, error, id, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-charcoal">
      {label}
    </label>
    <input
      ref={ref}
      id={id}
      className={cn(fieldClasses, error && 'border-red-400', className)}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
))
Input.displayName = 'Input'

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & LabeledFieldProps
>(({ label, error, id, className, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-charcoal">
      {label}
    </label>
    <textarea
      ref={ref}
      id={id}
      className={cn(fieldClasses, 'min-h-[120px] resize-y', error && 'border-red-400', className)}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    />
    {error && (
      <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
))
Textarea.displayName = 'Textarea'

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & LabeledFieldProps
>(({ label, error, id, className, children, ...props }, ref) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-semibold text-charcoal">
      {label}
    </label>
    <select
      ref={ref}
      id={id}
      className={cn(fieldClasses, error && 'border-red-400', className)}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...props}
    >
      {children}
    </select>
    {error && (
      <p id={`${id}-error`} className="text-sm text-red-600" role="alert">
        {error}
      </p>
    )}
  </div>
))
Select.displayName = 'Select'
