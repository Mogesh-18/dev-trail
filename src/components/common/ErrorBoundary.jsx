import { Component } from "react";
import { Button } from "@/components/ui/button";
import { CompassIcon } from "lucide-react";

/**
 * Full-page crash fallback, aligned with ErrorState's icon/shadow
 * language instead of a plain centered block.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Unhandled UI error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center duration-slow animate-in fade-in zoom-in-95">
                    <span className="flex h-16 w-16 animate-float items-center justify-center rounded-full bg-destructive/10 text-destructive">
                        <CompassIcon className="h-8 w-8" />
                    </span>
                    <div className="space-y-1.5">
                        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
                        <p className="max-w-sm text-sm text-muted-foreground">
                            An unexpected error occurred. Try reloading the page.
                        </p>
                    </div>
                    <Button
                        onClick={() => window.location.reload()}
                        className="shadow-[var(--shadow-md)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-lg)] active:scale-95"
                    >
                        Reload
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}