import { useId } from "react";
import { BrandMark } from "@/components/common/BrandMark";

/**
 * Full-screen premium loading gate. `detail` is optional secondary
 * copy (e.g. RouterRoot's cold-start explanation) that fades in below
 * the main label without changing the loader's layout.
 *
 * `w-full max-w-full overflow-hidden` on the root and `break-words` on
 * the detail text guard specifically against the mobile sideways-scroll
 * bug — this screen renders before AppShell exists, so it can't rely
 * on AppShell's overflow containment.
 *
 * @param {Object} props
 * @param {string} [props.label="Loading DevTrail…"]
 * @param {string} [props.detail]
 * @returns {JSX.Element}
 */
export function PageLoader({ label = "Loading DevTrail…", detail }) {
    const gradId = `page-loader-${useId()}`;

    return (
        <div className="fixed inset-0 z-50 flex w-full max-w-full flex-col items-center justify-center gap-6 overflow-hidden bg-background px-4">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-pulse-glow rounded-full bg-primary/15 blur-3xl" />
            <div
                className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 animate-pulse-glow rounded-full bg-accent/15 blur-3xl"
                style={{ animationDelay: "0.7s" }}
            />

            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                <svg viewBox="0 0 80 80" className="absolute inset-0 h-20 w-20 animate-[spin_2s_linear_infinite]">
                    <defs>
                        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="50%" stopColor="hsl(var(--secondary))" />
                            <stop offset="100%" stopColor="hsl(var(--accent))" />
                        </linearGradient>
                    </defs>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
                    <circle
                        cx="40" cy="40" r="34" fill="none"
                        stroke={`url(#${gradId})`}
                        strokeWidth="4" strokeLinecap="round"
                        strokeDasharray="64 150"
                    />
                </svg>
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-[var(--shadow-md)]">
                    <BrandMark className="h-5 w-5 animate-pulse text-primary" />
                </span>
            </div>

            <div className="flex w-full max-w-xs flex-col items-center gap-3 text-center duration-slow animate-in fade-in">
                <p className="animate-[gradient-x_3s_ease_infinite] bg-gradient-to-r from-primary via-secondary to-accent bg-[length:200%_auto] bg-clip-text text-sm font-semibold tracking-wide text-transparent">
                    {label}
                </p>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <span
                            key={i}
                            className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        />
                    ))}
                </div>
                {detail && (
                    <p className="break-words text-xs text-muted-foreground duration-base animate-in fade-in slide-in-from-bottom-1">
                        {detail}
                    </p>
                )}
            </div>
        </div>
    );
}