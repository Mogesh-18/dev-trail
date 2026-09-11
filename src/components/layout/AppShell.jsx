import { useState } from "react";
import { Outlet } from "@tanstack/react-router";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { GlobalSearchDialog } from "@/features/search/components/GlobalSearchDialog";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/constants/roles";
import { ADMIN_NAV_ITEMS, STUDENT_NAV_ITEMS } from "@/constants/navigation";

/**
 * Main app shell. `overflow-x-hidden` on the root wrapper is the
 * second line of defense against the mobile sideways-scroll bug
 * (index.css handles html/body/#root; this covers the shell itself
 * in case any client nests it inside another scroll container later).
 *
 * @returns {JSX.Element}
 */
export function AppShell() {
    const { role } = useAuth();
    const navItems = role === ROLES.ADMIN ? ADMIN_NAV_ITEMS : STUDENT_NAV_ITEMS;
    const [searchOpen, setSearchOpen] = useState(false);

    useKeyboardShortcut({ key: "k", meta: true }, () => setSearchOpen((v) => !v));

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-background text-foreground md:flex">
            <Sidebar navItems={navItems} />
            <div className="flex min-h-screen w-full min-w-0 flex-1 flex-col overflow-x-hidden">
                <MobileHeader onOpenSearch={() => setSearchOpen(true)} />
                <Header navItems={navItems} onOpenSearch={() => setSearchOpen(true)} />
                <main className="w-full min-w-0 flex-1 animate-in fade-in slide-in-from-bottom-1 px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] duration-300 sm:px-6 md:px-8 md:pb-8 md:pt-8">
                    <Outlet />
                </main>
                <BottomNav navItems={navItems} />
            </div>
            <GlobalSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
    );
}