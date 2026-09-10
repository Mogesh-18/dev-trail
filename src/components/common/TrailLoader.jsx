import { cn } from "@/lib/utils";

/**
 * Branded loading indicator — ring now carries a soft primary-tinted
 * drop-shadow so it reads as "glowing" rather than flat currentColor.
 *
 * @param {Object} props
 * @param {"sm"|"md"} [props.size="md"]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
export function TrailLoader({ size = "md", className }) {
    const dimension = size === "sm" ? 20 : 40;

    return (
        <svg
            viewBox="0 0 40 40"
            width={dimension}
            height={dimension}
            className={cn("text-primary drop-shadow-[0_0_6px_hsl(var(--primary)/0.35)]", className)}
            role="status"
            aria-label="Loading"
        >
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="3" />
            <circle
                cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="3"
                strokeLinecap="round" strokeDasharray="26 74"
                className="origin-center animate-trail-spin"
            />
            <circle cx="20" cy="4" r="2.5" fill="currentColor" className="origin-center animate-trail-spin" />
        </svg>
    );
}