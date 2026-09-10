import { LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { BrandMark } from "@/components/common/BrandMark";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Mobile top header — buttons now use the shared spring press instead
 * of a plain scale-90, matching Header/BottomNav's tactile language.
 *
 * @param {Object} props
 * @param {() => void} props.onOpenSearch
 * @returns {JSX.Element}
 */
export function MobileHeader({ onOpenSearch }) {
    const { signOut } = useAuth();

    return (
        <header className="flex items-center justify-between border-b border-border/60 bg-background/80 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur md:hidden">
            <div className="group flex items-center gap-2">
                <BrandMark className="h-5 w-5 text-primary" />
                <span className="text-base font-semibold tracking-tight">DevTrail</span>
            </div>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" aria-label="Search" onClick={onOpenSearch} className="transition-transform duration-fast ease-spring active:scale-90">
                    <Search className="h-4 w-4" />
                </Button>
                <ThemeToggle />
                <Button variant="ghost" size="icon" aria-label="Sign out" onClick={() => signOut()} className="transition-transform duration-fast ease-spring active:scale-90">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
        </header>
    );
}