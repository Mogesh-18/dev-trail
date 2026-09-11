import { Link } from "@tanstack/react-router";
import { useRealtimeStatus } from "@/app/providers/RealtimeProvider";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { BrandMark } from "@/components/common/BrandMark";
import { InstallAppButton } from "@/features/notifications/components/InstallAppButton";
import { cn } from "@/lib/utils";

/**
 * Desktop sidebar, premium pass: gradient logo tile instead of a bare
 * glyph, active nav items get a gradient-wash pill with a glowing left
 * accent bar instead of a flat tint, icons sit in a small chip that
 * fills with color when active, and the footer is a single account
 * chip (avatar + status dot + email) instead of a plain text row.
 *
 * @param {Object} props
 * @param {Array<{ label: string, to: string, icon: React.ComponentType }>} props.navItems
 * @returns {JSX.Element}
 */
export function Sidebar({ navItems }) {
    const { connected } = useRealtimeStatus();
    const { user } = useAuth();
    const initials = (user?.email?.[0] ?? "?").toUpperCase();

    return (
        <aside className="relative hidden w-64 shrink-0 flex-col overflow-hidden border-r border-border/60 bg-card md:flex">
            {/* Soft ambient wash — barely-there, gives the panel depth without noise */}
            <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative flex items-center gap-3 px-5 py-6">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[var(--shadow-glow-primary)]">
                    <BrandMark className="h-5 w-5 text-primary-foreground" />
                </span>
                <div className="min-w-0">
                    <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-semibold leading-tight tracking-tight text-transparent">
                        DevTrail
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <span className={cn("h-1.5 w-1.5 rounded-full transition-colors duration-base", connected ? "animate-pulse-glow bg-status-completed" : "bg-status-locked")} />
                        {connected ? "Live" : "Reconnecting…"}
                    </span>
                </div>
            </div>

            <nav className="relative flex-1 space-y-1 px-3 pt-2">
                {navItems.map((item, i) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className={cn(
                            "group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground",
                            "duration-base ease-trail animate-in fade-in slide-in-from-left-2 fill-mode-both transition-all",
                            "hover:translate-x-0.5 hover:bg-muted hover:text-foreground",
                            "[&.active]:bg-gradient-to-r [&.active]:from-primary/12 [&.active]:via-accent/8 [&.active]:to-transparent [&.active]:text-foreground [&.active]:shadow-[var(--shadow-sm)]"
                        )}
                        activeProps={{ className: "active" }}
                    >
                        <span className="absolute inset-y-1.5 left-0 w-[3px] scale-y-0 rounded-full bg-gradient-to-b from-primary to-accent transition-transform duration-base ease-spring group-[.active]:scale-y-100" />
                        <span
                            className={cn(
                                "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all duration-base ease-spring",
                                "bg-transparent group-hover:bg-card group-hover:shadow-[var(--shadow-sm)]",
                                "group-[.active]:bg-gradient-to-br group-[.active]:from-primary group-[.active]:to-accent group-[.active]:shadow-[var(--shadow-glow-primary)]"
                            )}
                        >
                            <item.icon className="h-4 w-4 transition-transform duration-base group-hover:scale-110 group-[.active]:text-primary-foreground" />
                        </span>
                        <span className="relative z-10 truncate">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="relative space-y-2 border-t border-border/60 px-3 py-3">
                <InstallAppButton />
                <div className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors duration-fast hover:bg-muted">
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary font-mono text-xs font-semibold text-primary-foreground shadow-[var(--shadow-sm)]">
                        {initials}
                        <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-card", connected ? "bg-status-completed" : "bg-status-locked")} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{user?.email}</span>
                </div>
            </div>
        </aside>
    );
}