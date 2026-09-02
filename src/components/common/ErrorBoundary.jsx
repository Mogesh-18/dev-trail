import { Component } from "react";
import { Button } from "@/components/ui/button";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // No external error-reporting service — that's a paid dependency this
        // project deliberately doesn't have. Console only.
        console.error("Unhandled UI error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
                    <h1 className="text-xl font-semibold">Something went wrong</h1>
                    <p className="max-w-sm text-sm text-muted-foreground">
                        An unexpected error occurred. Try reloading the page.
                    </p>
                    <Button onClick={() => window.location.reload()}>Reload</Button>
                </div>
            );
        }
        return this.props.children;
    }
}