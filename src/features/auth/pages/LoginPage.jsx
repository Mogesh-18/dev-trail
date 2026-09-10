import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/common/BrandMark";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Login screen — the one place in the app that gets a genuine "hero"
 * treatment: soft blurred color orbs behind a floating brand mark,
 * card panel with real elevation, and a glowing primary CTA. Every
 * other page in the app is functional-first; this one earns a moment.
 *
 * @returns {JSX.Element}
 */
export default function LoginPage() {
    const { signInWithGoogle } = useAuth();

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

            <div className="relative w-full max-w-sm space-y-6 rounded-2xl border border-border/60 bg-card p-8 text-center shadow-[var(--shadow-lg)] duration-slow animate-in fade-in zoom-in-95">
                <BrandMark className="mx-auto h-10 w-10 animate-float text-primary" />
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">DevTrail</h1>
                    <p className="mt-1 text-muted-foreground">
                        Sign in with the Google account tied to this workspace.
                    </p>
                </div>
                <Button
                    className="w-full transition-all duration-fast ease-spring hover:shadow-[var(--shadow-glow-primary)] active:scale-95"
                    size="lg"
                    onClick={() => signInWithGoogle()}
                >
                    Continue with Google
                </Button>
            </div>
        </div>
    );
}