import { Component } from "react";
import { Button } from "@/components/ui/button";

/**
 * React class component that catches JavaScript errors in its child tree
 * and displays a fallback UI instead of crashing the app.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to be wrapped.
 * @returns {JSX.Element}
 */
export class ErrorBoundary extends Component {

    /**
     * Initialises the error boundary state.
     * 
     * @param {Object} props - Component props.
     */
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * Updates the state when an error is thrown in a child component.
     * 
     * @param {Error} error - The thrown error.
     * @returns {{ hasError: boolean }} New state with `hasError: true`.
     */
    static getDerivedStateFromError() {
        return { hasError: true };
    }

    /**
     * Logs the error to the console. (No external error‑reporting service used.)
     * 
     * @param {Error} error - The thrown error.
     * @param {React.ErrorInfo} info - Component stack information.
     */
    componentDidCatch(error, info) {
        console.error("Unhandled UI error:", error, info);
    }

    /**
     * Renders the fallback UI when an error occurred, otherwise renders children.
     * 
     * @returns {JSX.Element}
     */
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