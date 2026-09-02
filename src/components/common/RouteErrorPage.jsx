import { Button } from "@/components/ui/button";

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