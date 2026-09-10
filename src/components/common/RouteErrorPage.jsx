import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CompassIcon } from "lucide-react";

/**
 * Route-level error fallback — same floating-icon/shadow language as
 * ErrorBoundary/ErrorState, so all three "something failed" surfaces
 * feel like one system instead of three separate designs.
 *
 * @param {Object} props
 * @param {Error} [props.error]
 * @returns {JSX.Element}
 */
export default function RouteErrorPage({ error }) {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center duration-slow animate-in fade-in zoom-in-95">
            <span className="flex h-14 w-14 animate-float items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <CompassIcon className="h-7 w-7" />
            </span>
            <div className="space-y-1.5">
                <h1 className="text-xl font-semibold tracking-tight">This checkpoint didn't load</h1>
                {error?.message && (
                    <p className="max-w-md text-sm text-muted-foreground">{error.message}</p>
                )}
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="shadow-[var(--shadow-sm)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-md)] active:scale-95"
                >
                    Retry
                </Button>
                <Button
                    asChild
                    className="shadow-[var(--shadow-md)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-lg)] active:scale-95"
                >
                    <Link to="/">Back to trailhead</Link>
                </Button>
            </div>
        </div>
    );
}