import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Branded inline loader — a gradient-stroke ring (indigo → violet)
 * with an orbiting marker dot, rotating on a continuous linear timing
 * so it never stutters at the loop boundary. useId keeps the SVG
 * gradient unique per instance so multiple loaders on screen at once
 * don't collide on the same gradient id.
 *
 * @param {Object} props
 * @param {"sm"|"md"} [props.size="md"]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function TrailLoader({ size = "md", className }) {
    const gradId = `trail-loader-${useId()}`;
    const dimension = size === "sm" ? 20 : 40;

    return (
        <svg
            viewBox="0 0 40 40"
            width={dimension}
            height={dimension}
            className={cn("drop-shadow-[0_0_6px_hsl(var(--primary)/0.35)]", className)}
            role="status"
            aria-label="Loading"
        >
            <defs>
                <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="16" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
            <g className="origin-center animate-[spin_1.1s_linear_infinite]">
                <circle
                    cx="20" cy="20" r="16" fill="none"
                    stroke={`url(#${gradId})`}
                    strokeWidth="3" strokeLinecap="round"
                    strokeDasharray="26 74"
                />
                <circle cx="20" cy="4" r="2.5" fill="hsl(var(--accent))" />
            </g>
        </svg>
    );
}