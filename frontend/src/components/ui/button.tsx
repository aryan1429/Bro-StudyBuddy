import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { motion } from "framer-motion"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-md hover:shadow-lg",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
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
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, children, ...props }, ref) => {
        const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([])

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const newRipple = { x, y, id: Date.now() }

            setRipples((prev) => [...prev, newRipple])

            // Remove ripple after animation
            setTimeout(() => {
                setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
            }, 600)

            // Call original onClick if provided
            if (props.onClick) {
                props.onClick(e)
            }
        }

        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
                onClick={handleClick}
            >
                {/* Ripple effects */}
                {ripples.map((ripple) => (
                    <span
                        key={ripple.id}
                        className="absolute bg-white/30 rounded-full pointer-events-none animate-ripple"
                        style={{
                            left: ripple.x,
                            top: ripple.y,
                            width: 0,
                            height: 0,
                        }}
                    />
                ))}

                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
