import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

/**
 * Full‑page 404 error display with a link back to the home page.
 * 
 * @returns {JSX.Element}
 */
export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
            <h1 className="text-2xl font-semibold">Page not found</h1>
            <p className="text-muted-foreground">That page doesn't exist.</p>
            <Button asChild>
                <Link to="/">Go home</Link>
            </Button>
        </div>
    );
}