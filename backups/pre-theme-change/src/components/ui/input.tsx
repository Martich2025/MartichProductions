import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-mp-white">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-mp-gray-700 bg-mp-charcoal px-3 py-2 text-sm text-mp-white placeholder:text-mp-gray-400 focus:border-mp-gold focus:outline-none focus:ring-2 focus:ring-mp-gold/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-mp-red focus:border-mp-red focus:ring-mp-red/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-mp-red">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-mp-gray-300">{helper}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; helper?: string }>(
  ({ className, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-mp-white">
            {label}
          </label>
        )}
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-mp-gray-700 bg-mp-charcoal px-3 py-2 text-sm text-mp-white placeholder:text-mp-gray-400 focus:border-mp-gold focus:outline-none focus:ring-2 focus:ring-mp-gold/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-mp-red focus:border-mp-red focus:ring-mp-red/20",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-mp-red">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-mp-gray-300">{helper}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; helper?: string }>(
  ({ className, children, label, error, helper, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-mp-white">
            {label}
          </label>
        )}
        <select
          className={cn(
            "flex h-10 w-full rounded-lg border border-mp-gray-700 bg-mp-charcoal px-3 py-2 text-sm text-mp-white focus:border-mp-gold focus:outline-none focus:ring-2 focus:ring-mp-gold/20 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-mp-red focus:border-mp-red focus:ring-mp-red/20",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {error && (
          <p className="text-sm text-mp-red">{error}</p>
        )}
        {helper && !error && (
          <p className="text-sm text-mp-gray">{helper}</p>
        )}
      </div>
    )
  }
)
Select.displayName = "Select"

export { Input, Textarea, Select }
