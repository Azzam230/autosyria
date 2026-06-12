import { HTMLAttributes, forwardRef } from "react"

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "danger" | "warning"
}

const variantStyles = {
  default: "bg-card text-muted border-border",
  success: "bg-green-900/30 text-green-400 border-green-800",
  danger: "bg-red-900/30 text-red-400 border-red-800",
  warning: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = "Badge"
export default Badge
