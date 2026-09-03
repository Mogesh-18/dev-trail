import { Button } from "@/components/ui/button";

/**
 * Full‑page error display used by the router when a route fails to load.
 * 
 * @param {Object} props
 * @param {Error} [props.error] - The caught error object.
 * @returns {JSX.Element}
 */
export default function RouteErrorPage({ error }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
            <h1 className="text-xl font-semibold">Couldn't load this page</h1>
            <p className="max-w-sm text-sm text-muted-foreground">
                {error?.message || "Something went wrong. Please try again."}
            </p>
            <Button onClick={() => window.location.reload()}>Reload</Button>
        </div>
    );
}