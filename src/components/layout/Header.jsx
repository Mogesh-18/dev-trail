import { useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { NotificationToggle } from "@/features/notifications/components/NotificationToggle";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Persistent desktop header. Search trigger now lifts with a real
 * shadow on hover instead of just a border tint; avatar has a press
 * scale and the dropdown panel now carries shadow-lg instead of the
 * shadcn default flat shadow.
 *
 * @param {Object} props
 * @param {Array<{ label: string, to: string, icon: React.ComponentType }>} props.navItems
 * @param {() => void} props.onOpenSearch
 * @returns {JSX.Element}
 */
export function Header({ navItems, onOpenSearch }) {
    const { user, signOut } = useAuth();
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    const activeItem = navItems.find(
        (item) => pathname === item.to || pathname.startsWith(`${item.to}/`)
    );
    const initials = (user?.email?.[0] ?? "?").toUpperCase();

    return (
        <header className="hidden h-16 shrink-0 items-center gap-4 border-b border-border/60 bg-background/80 px-6 backdrop-blur md:flex">
            <div className="flex min-w-0 items-center gap-2 duration-base animate-in fade-in slide-in-from-left-1" key={activeItem?.to}>
                {activeItem?.icon && (
                    <activeItem.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <h1 className="truncate text-base font-semibold tracking-tight">
                    {activeItem?.label ?? "DevTrail"}
                </h1>
            </div>

            <button
                onClick={onOpenSearch}
                className="ml-2 flex w-64 items-center gap-2 rounded-md border border-border/70 bg-card px-3 py-1.5 text-sm text-muted-foreground shadow-[var(--shadow-sm)] transition-all duration-base ease-trail hover:-translate-y-px hover:border-primary/40 hover:text-foreground hover:shadow-[var(--shadow-md)]"
            >
                <Search className="h-3.5 w-3.5" />
                <span>Search…</span>
                <kbd className="ml-auto rounded border border-border/70 bg-muted px-1.5 py-0.5 font-mono text-[10px]">
                    ⌘K
                </kbd>
            </button>

            <div className="ml-auto flex items-center gap-1">
                <NotificationToggle />
                <ThemeToggle />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full transition-transform duration-fast ease-spring hover:scale-105 active:scale-95"
                            aria-label="Account menu"
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-mono text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)]">
                                {initials}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="w-56 shadow-[var(--shadow-lg)] data-[state=open]:duration-base data-[state=open]:ease-trail"
                    >
                        <DropdownMenuLabel className="truncate font-normal text-muted-foreground">
                            {user?.email}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>Sign out</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}