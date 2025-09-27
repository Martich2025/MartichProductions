import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-brand text-canvas hover:bg-brand-hover focus-visible:ring-brand",
        primary: "bg-brand text-canvas hover:bg-brand-hover focus-visible:ring-brand",
        secondary: "bg-surface text-primary hover:bg-surface-elevated",
        outline: "border-2 border-brand text-brand hover:bg-brand-wash hover:text-brand",
        ghost: "text-brand hover:bg-brand-wash",
        destructive: "bg-danger text-primary hover:bg-danger/90",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  href?: string
  target?: string
  rel?: string
  preserveQuery?: boolean
}

        const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
          ({ className, variant, size, loading = false, href, target, rel, preserveQuery = false, children, ...props }, ref) => {
    if (href) {
      const search = preserveQuery && typeof window !== 'undefined' ? window.location.search : ''
      const lockedPaths = ['/engine/map']
      const isLocked = typeof window !== 'undefined' && lockedPaths.some(p => window.location.pathname.startsWith(p))
      const canPreserve = preserveQuery && !isLocked
      const url = href + (canPreserve && search ? (href.includes('?') ? '&' : '?') + search.replace(/^\?/, '') : '')
      const computedRel = target === '_blank' ? (rel || 'noopener noreferrer') : rel
      return (
        <a
          href={url}
          target={target}
          rel={computedRel}
          className={cn('btn', buttonVariants({ variant, size, className }))}
        >
          {loading && (
            <svg
              className="animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          )}
          {children}
        </a>
      )
    }
    
    return (
      <button
        className={cn('btn', buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }