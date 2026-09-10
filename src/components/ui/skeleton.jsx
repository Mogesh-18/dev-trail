import { cn } from "@/lib/utils";

/**
 * Loading placeholder with a diagonal shimmer sweep instead of a flat
 * pulse — reads as "actively loading" rather than a static gray block.
 *
 * @param {Object} props
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-md bg-muted",
                "before:absolute before:inset-0 before:-translate-x-full before:animate-shimmer",
                "before:bg-gradient-to-r before:from-transparent before:via-card/60 before:to-transparent",
                className
            )}
            {...props}
        />
    );
}