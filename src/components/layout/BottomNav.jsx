import { Link } from "@tanstack/react-router";

/**
 * Mobile bottom nav — active marker bar now springs in with scale +
 * shadow glow instead of a flat scale-x, and icons get a press-down
 * scale for tactile feedback on tap (mobile's equivalent of hover).
 *
 * @param {Object} props
 * @param {Array<{ label: string, to: string, icon: React.ComponentType }>} props.navItems
 * @returns {JSX.Element}
 */
export function BottomNav({ navItems }) {
    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-card/95 shadow-[0_-4px_16px_-8px_hsl(var(--shadow-color)/0.15)] backdrop-blur md:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
            {navItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    className="group relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors duration-fast active:scale-90 [&.active]:text-primary"
                    activeProps={{ className: "active" }}
                >
                    <span className="absolute top-0 h-0.5 w-6 scale-x-0 rounded-full bg-primary shadow-[var(--shadow-glow-primary)] transition-transform duration-base ease-spring [.active_&]:scale-x-100" />
                    <item.icon className="h-5 w-5 transition-transform duration-fast ease-spring group-active:scale-90" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}