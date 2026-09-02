import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function Sidebar({ navItems }) {
    const { user, signOut } = useAuth();

    return (
        <aside className="hidden w-60 shrink-0 flex-col border-r bg-card md:flex">
            <div className="px-5 py-5">
                <span className="text-lg font-semibold">DevTrail</span>
            </div>
            <nav className="flex-1 space-y-1 px-3">
                {navItems.map((item) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&.active]:bg-primary/10 [&.active]:text-primary"
                        activeProps={{ className: "active" }}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="space-y-2 border-t px-3 py-3">
                <div className="flex items-center justify-between px-1">
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                    <ThemeToggle />
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => signOut()}
                >
                    <LogOut className="h-4 w-4" />
                    Sign out
                </Button>
            </div>
        </aside>
    );
}