import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Max number of direct tabs shown before the rest collapse into
 * "More" (one of those slots is the More tab itself, so up to
 * MAX_VISIBLE - 1 nav items can show directly).
 */
const MAX_VISIBLE = 4;

/**
 * Splits nav items into (direct tabs, overflow) using each item's
 * `pinned` flag rather than array position. Pinned items always make
 * the direct row, in their original order; if fewer than
 * (MAX_VISIBLE - 1) items are pinned, remaining slots are filled from
 * the unpinned items in order so the bar never shows fewer tabs than
 * it has room for. Everything not selected for the direct row goes to
 * overflow, still in original order.
 *
 * @param {Array<{to: string, pinned?: boolean}>} navItems
 * @returns {{ visibleItems: Array, overflowItems: Array }}
 */
function splitNavItems(navItems) {
    if (navItems.length <= MAX_VISIBLE) {
        return { visibleItems: navItems, overflowItems: [] };
    }

    const slots = MAX_VISIBLE - 1;
    const pinned = navItems.filter((item) => item.pinned);
    const unpinned = navItems.filter((item) => !item.pinned);

    const visibleItems = [...pinned.slice(0, slots)];
    if (visibleItems.length < slots) {
        visibleItems.push(...unpinned.slice(0, slots - visibleItems.length));
    }
    // Preserve original relative order in the direct row rather than
    // "all pinned first" ordering, so tabs don't jump around visually
    // compared to how the list reads elsewhere (e.g. desktop Sidebar).
    const visibleSet = new Set(visibleItems.map((item) => item.to));
    const orderedVisible = navItems.filter((item) => visibleSet.has(item.to));
    const overflowItems = navItems.filter((item) => !visibleSet.has(item.to));

    return { visibleItems: orderedVisible, overflowItems };
}

/**
 * Mobile bottom nav. Direct tabs vs. "More" overflow are decided by
 * each item's `pinned` flag (see splitNavItems) instead of array
 * position. The More tab shows active styling whenever the current
 * route matches a hidden item, so active state is never lost.
 *
 * @param {Object} props
 * @param {Array<{ label: string, to: string, icon: React.ComponentType, pinned?: boolean }>} props.navItems
 * @returns {JSX.Element}
 */
export function BottomNav({ navItems }) {
    const [moreOpen, setMoreOpen] = useState(false);
    const pathname = useRouterState({ select: (s) => s.location.pathname });

    const { visibleItems, overflowItems } = splitNavItems(navItems);
    const needsOverflow = overflowItems.length > 0;
    const overflowIsActive = overflowItems.some((item) => pathname === item.to || pathname.startsWith(`${item.to}/`));

    return (
        <>
            <nav
                className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border/60 bg-card/95 shadow-[0_-4px_16px_-8px_hsl(var(--shadow-color)/0.15)] backdrop-blur md:hidden"
                style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
            >
                {visibleItems.map((item) => (
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

                {needsOverflow && (
                    <button
                        type="button"
                        onClick={() => setMoreOpen(true)}
                        className={cn(
                            "group relative flex min-h-[56px] flex-1 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors duration-fast active:scale-90",
                            overflowIsActive ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <span
                            className={cn(
                                "absolute top-0 h-0.5 w-6 rounded-full bg-primary shadow-[var(--shadow-glow-primary)] transition-transform duration-base ease-spring",
                                overflowIsActive ? "scale-x-100" : "scale-x-0"
                            )}
                        />
                        <MoreHorizontal className="h-5 w-5 transition-transform duration-fast ease-spring group-active:scale-90" />
                        More
                    </button>
                )}
            </nav>

            {needsOverflow && (
                <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
                    <SheetContent
                        side="bottom"
                        className="rounded-t-xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] shadow-[var(--shadow-lg)] data-[state=open]:duration-base data-[state=open]:ease-trail md:hidden"
                    >
                        <SheetHeader>
                            <SheetTitle>More</SheetTitle>
                        </SheetHeader>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                            {overflowItems.map((item) => {
                                const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);
                                return (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        onClick={() => setMoreOpen(false)}
                                        className={cn(
                                            "flex flex-col items-center gap-1.5 rounded-xl border border-border/60 p-3 text-center text-xs font-medium transition-all duration-base ease-trail active:scale-95",
                                            isActive
                                                ? "border-primary/40 bg-primary/10 text-primary shadow-[var(--shadow-sm)]"
                                                : "text-muted-foreground hover:border-primary/20 hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </SheetContent>
                </Sheet>
            )}
        </>
    );
}