import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Login page with a "Sign in with Google" button.
 * 
 * @returns {JSX.Element}
 */
export default function LoginPage() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-6 text-center">
                <div>
                    <h1 className="text-2xl font-semibold">DevTrail</h1>
                    <p className="text-muted-foreground">
                        Sign in with the Google account tied to this workspace.
                    </p>
                </div>
                <Button className="w-full" size="lg" onClick={() => signInWithGoogle()}>
                    Continue with Google
                </Button>
            </div>
        </div>
    );
}