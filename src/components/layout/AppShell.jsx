import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { GlobalSearchDialog } from "@/features/search/components/GlobalSearchDialog";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/constants/roles";
import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS } from "@/constants/navigation";

/**
 * The main application shell containing the sidebar, mobile header, bottom navigation,
 * and an outlet for route content. The navigation items are determined by the user's role.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - (Not used directly; rendered via `<Outlet />`)
 * @returns {JSX.Element}
 */
export function AppShell() {
    const { role } = useAuth();
    const navItems = role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;
    const [searchOpen, setSearchOpen] = useState(false);

    useKeyboardShortcut({ key: "k", meta: true }, () => setSearchOpen((v) => !v));

    return (
        <div className="min-h-screen bg-background text-foreground md:flex">
            <Sidebar navItems={navItems} onOpenSearch={() => setSearchOpen(true)} />
            <div className="flex min-h-screen flex-1 flex-col">
                <MobileHeader onOpenSearch={() => setSearchOpen(true)} />
                <main className="flex-1 px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 md:pb-6 md:pt-6">
                    <Outlet />
                </main>
                <BottomNav navItems={navItems} />
            </div>
            <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
    );
}