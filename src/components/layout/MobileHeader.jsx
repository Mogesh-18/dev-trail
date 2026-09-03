import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * A top header bar for mobile devices, showing the app name, theme toggle, and sign‑out button.
 * 
 * @returns {JSX.Element}
 */
export function MobileHeader() {
    const { signOut } = useAuth();

    return (
        <header className="flex items-center justify-between border-b px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:hidden">
            <span className="text-base font-semibold">DevTrail</span>
            <div className="flex items-center gap-1">
                <ThemeToggle />
                <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut()}>
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}