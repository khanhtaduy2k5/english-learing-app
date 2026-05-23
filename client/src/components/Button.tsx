import * as React from "react"
import { Button as ShadcnButton } from "@/components/ui/button"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  disabled,
  ...props
}) => {
  // Map old props to shadcn props
  const shadcnVariant = 
    variant === "primary" ? "gradient" :
    variant === "secondary" ? "secondary" :
    variant === "danger" ? "destructive" :
    variant === "glass" ? "glass" : "default";

  const shadcnSize =
    size === "sm" ? "sm" :
    size === "lg" ? "lg" : "default";

  return (
    <ShadcnButton
      variant={shadcnVariant as any}
      size={shadcnSize as any}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2 justify-center">
          <svg className="animate-spin h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </ShadcnButton>
  )
}
