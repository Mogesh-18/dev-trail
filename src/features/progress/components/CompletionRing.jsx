import { useId } from "react";

/**
 * Small gradient-stroke completion ring — reused wherever a percentage
 * needs a glanceable visual instead of just a number. Text is
 * overlaid via a centered absolutely-positioned span rather than SVG
 * <text>, since counter-rotating text inside a rotated <svg> is more
 * fragile than just layering HTML on top.
 *
 * @param {Object} props
 * @param {number} props.percent - 0 to 100.
 * @param {number} [props.size=56]
 * @param {number} [props.strokeWidth=6]
 * @returns {JSX.Element}
 */
export function CompletionRing({ percent, size = 56, strokeWidth = 6 }) {
    const gradId = useId();
    const clamped = Math.min(Math.max(percent, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (clamped / 100) * circumference;

    return (
        <div className="relative shrink-0" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                </defs>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth={strokeWidth} />
                <circle
                    cx={size / 2} cy={size / 2} r={radius} fill="none"
                    stroke={`url(#${gradId})`} strokeWidth={strokeWidth} strokeLinecap="round"
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    className="transition-[stroke-dashoffset] duration-slow ease-trail"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold">
                {clamped}%
            </span>
        </div>
    );
}