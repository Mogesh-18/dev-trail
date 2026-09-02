import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function UnauthorizedPage() {
    const { signOut } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-4 text-center">
                <h1 className="text-2xl font-semibold">Not authorized</h1>
                <p className="text-muted-foreground">
                    This Google account isn't set up for DevTrail. Sign in with the
                    admin or student account this workspace was configured for.
                </p>
                <Button variant="outline" onClick={() => signOut()}>
                    Try a different account
                </Button>
            </div>
        </div>
    );
}