import { Link } from "@tanstack/react-router";
import { useRealtimeStatus } from "@/app/providers/RealtimeProvider";
import { BrandMark } from "@/components/common/BrandMark";
import { InstallAppButton } from "@/features/notifications/components/InstallAppButton";
import { cn } from "@/lib/utils";

/**
 * Desktop sidebar — vertical trail nav. Active item now gets a tinted
 * glow shadow on its marker dot (matching StatCard's language) and a
 * slide-right on hover instead of just a color swap; live-sync dot
 * pulses gently while connected instead of sitting static.
 *
 * @param {Object} props
 * @param {Array<{ label: string, to: string, icon: React.ComponentType }>} props.navItems
 * @returns {JSX.Element}
 */
export function Sidebar({ navItems }) {
    const { connected } = useRealtimeStatus();

    return (
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border/60 bg-card md:flex">
            <div className="group flex items-center gap-2.5 px-6 py-6">
                <BrandMark className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold tracking-tight">DevTrail</span>
                <span
                    className={cn(
                        "ml-auto h-2 w-2 rounded-full transition-colors duration-base",
                        connected ? "animate-pulse-glow bg-status-completed" : "bg-status-locked"
                    )}
                    title={connected ? "Live sync connected" : "Reconnecting…"}
                />
            </div>

            <nav className="relative flex-1 space-y-0.5 px-4 pt-2">
                <div className="pointer-events-none absolute bottom-4 left-[15px] top-2 w-px bg-border" />
                {navItems.map((item, i) => (
                    <Link
                        key={item.to}
                        to={item.to}
                        style={{ animationDelay: `${i * 40}ms` }}
                        className="group relative flex items-center gap-3 rounded-md py-2 pl-0.5 pr-3 text-sm font-medium text-muted-foreground duration-base ease-trail animate-in fade-in slide-in-from-left-2 fill-mode-both transition-[color,transform] hover:translate-x-0.5 hover:text-foreground [&.active]:bg-primary/10 [&.active]:text-foreground"
                        activeProps={{ className: "active" }}
                    >
                        <span className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center">
                            <span className="h-2 w-2 rounded-full border-2 border-border bg-card transition-all duration-base ease-spring group-[.active]:scale-110 group-[.active]:border-primary group-[.active]:bg-primary group-[.active]:shadow-[var(--shadow-glow-primary)]" />
                        </span>
                        <item.icon className="h-4 w-4 shrink-0 transition-transform duration-base group-hover:scale-110" />
                        <span className="truncate">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="border-t border-border/60 px-4 py-4">
                <InstallAppButton />
            </div>
        </aside>
    );
}