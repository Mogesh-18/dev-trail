import { useCountUp } from "@/hooks/use-count-up";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

/**
 * Dashboard stat card. Accepts either a raw number (animated count-up)
 * or a pre-formatted string ("72%", "5 / 12") shown as-is. `hint`
 * renders as a native tooltip via title — used for things like a
 * comma-joined list of delayed task names that shouldn't sit in the
 * card body permanently.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {number|string} props.value
 * @param {React.ComponentType} [props.icon]
 * @param {number} [props.delta]
 * @param {string} [props.hint]
 * @param {"primary"|"secondary"|"accent"} [props.tone="primary"]
 * @returns {JSX.Element}
 */
export function StatCard({ label, value, icon: Icon, delta, hint, tone = "primary" }) {
    const display = useCountUp(value);
    const toneClasses = {
        primary: "text-primary bg-primary/10",
        secondary: "text-secondary bg-secondary/10",
        accent: "text-accent bg-accent/10",
    };
    const glowShadow = {
        primary: "var(--shadow-glow-primary)",
        secondary: "var(--shadow-md)",
        accent: "var(--shadow-glow-accent)",
    };

    return (
        <div
            title={hint}
            className="group relative overflow-hidden rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail hover:-translate-y-1 hover:border-transparent"
            style={{ "--hover-shadow": glowShadow[tone] }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--hover-shadow)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "")}
        >
            <div
                className={cn(
                    "pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-slow group-hover:opacity-100",
                    tone === "primary" && "bg-primary/25",
                    tone === "secondary" && "bg-secondary/25",
                    tone === "accent" && "bg-accent/25"
                )}
            />

            <div className="relative flex items-start justify-between">
                <span className="text-sm font-medium text-muted-foreground">{label}</span>
                {Icon && (
                    <span className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-base group-hover:scale-110", toneClasses[tone])}>
                        <Icon className="h-4 w-4" />
                    </span>
                )}
            </div>

            <div className="relative mt-3 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-semibold tabular-nums tracking-tight">
                    {display}
                </span>
                {typeof delta === "number" && delta !== 0 && (
                    <span className={cn("flex items-center gap-0.5 text-xs font-medium", delta > 0 ? "text-status-completed" : "text-destructive")}>
                        {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(delta)}
                    </span>
                )}
            </div>
        </div>
    );
}