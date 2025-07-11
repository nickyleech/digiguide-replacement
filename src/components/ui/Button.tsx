import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-sm font-light transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide'
    
    const variants = {
      primary: 'bg-primary-800 hover:bg-primary-900 text-white transform hover:-translate-y-0.5',
      secondary: 'bg-transparent hover:bg-primary-100 text-primary-800 border border-primary-300 hover:border-primary-400 transform hover:-translate-y-0.5',
      outline: 'border border-primary-400 text-primary-800 hover:bg-primary-50 transform hover:-translate-y-0.5',
      ghost: 'text-primary-600 hover:bg-primary-100 transform hover:-translate-y-0.5',
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base',
    }
    
    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }