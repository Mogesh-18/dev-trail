import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Base button. Every variant now carries a real shadow that deepens on
 * hover and compresses on press — this is the single most-used
 * interactive element in the app, so its feel sets the tone for
 * everything else. Focus ring uses the glow token, not a flat outline.
 */
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-fast ease-spring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-glow-primary)] hover:-translate-y-px",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-[var(--shadow-sm)] hover:shadow-[0_10px_28px_-10px_hsl(var(--destructive)/0.45)] hover:-translate-y-px",
                outline:
                    "border border-border bg-card shadow-[var(--shadow-sm)] hover:border-primary/40 hover:bg-accent/5 hover:shadow-[var(--shadow-md)]",
                secondary:
                    "bg-secondary text-secondary-foreground shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:-translate-y-px",
                ghost: "hover:bg-accent/10 hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: { variant: "default", size: "default" },
    }
);

export const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = "Button";