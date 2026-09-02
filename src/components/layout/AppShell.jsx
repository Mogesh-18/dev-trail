import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/constants/roles";
import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS } from "@/constants/navigation";

export function AppShell() {
    const { role } = useAuth();
    const navItems = role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;

    return (
        <div className="min-h-screen bg-background text-foreground md:flex">
            <Sidebar navItems={navItems} />
            <div className="flex min-h-screen flex-1 flex-col">
                <MobileHeader />
                <main className="flex-1 px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-6 md:pt-6">
                    <Outlet />
                </main>
                <BottomNav navItems={navItems} />
            </div>
        </div>
    );
}