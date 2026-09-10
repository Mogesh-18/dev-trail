import { CompassIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Shown when the signed-in Google account isn't on the allowlist.
 * Styled consistently with ErrorState/RouteErrorPage's floating-icon
 * language rather than a plain unstyled block.
 *
 * @returns {JSX.Element}
 */
export default function UnauthorizedPage() {
    const { signOut } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-4 text-center duration-slow animate-in fade-in zoom-in-95">
                <span className="mx-auto flex h-14 w-14 animate-float items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <CompassIcon className="h-7 w-7" />
                </span>
                <h1 className="text-2xl font-semibold tracking-tight">Not authorized</h1>
                <p className="text-muted-foreground">
                    This Google account isn't set up for DevTrail. Sign in with the
                    admin or student account this workspace was configured for.
                </p>
                <Button
                    variant="outline"
                    onClick={() => signOut()}
                    className="shadow-[var(--shadow-sm)] transition-all duration-fast ease-spring hover:shadow-[var(--shadow-md)] active:scale-95"
                >
                    Try a different account
                </Button>
            </div>
        </div>
    );
}