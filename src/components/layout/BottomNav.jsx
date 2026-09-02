import { Link } from "@tanstack/react-router";

export function BottomNav({ navItems }) {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-card/95 backdrop-blur md:hidden">
            {navItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground [&.active]:text-primary"
                    activeProps={{ className: "active" }}
                >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}