import { LayoutDashboard, ListChecks, ClipboardList, TrendingUp, CalendarClock, CalendarDays, StickyNote, Users, UserCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";

/**
 * Navigation items for admin users. `pinned: true` marks an item as
 * always visible as a direct BottomNav tab on mobile, regardless of
 * array position — BottomNav fills remaining tab slots from unpinned
 * items in order if fewer than (MAX_VISIBLE - 1) are pinned. Everything
 * else collapses into "More". Desktop Sidebar ignores `pinned` entirely
 * and always shows the full list in order.
 *
 * Defaults below (Dashboard/Tasks/Assignments pinned) reproduce the
 * same three tabs that were previously pinned by array position —
 * flip these to change which tabs stay on the bar.
 * 
 * @type {Array<{ label: string, to: string, icon: React.ComponentType, pinned?: boolean }>}
 */
export const ADMIN_NAV_ITEMS = [
    {
        label: "Dashboard",
        to: ROUTES.ADMIN_DASHBOARD,
        icon: LayoutDashboard,
        pinned: true,
    },
    {
        label: "Tasks",
        to: ROUTES.ADMIN_TASKS,
        icon: ListChecks,
        pinned: true,
    },
    {
        label: "Assignments",
        to: ROUTES.ADMIN_ASSIGNMENTS,
        icon: ClipboardList,
        pinned: true,
    },
    {
        label: "Progress",
        to: ROUTES.ADMIN_PROGRESS,
        icon: TrendingUp
    },
    {
        label: "Timeline",
        to: ROUTES.ADMIN_TIMELINE,
        icon: CalendarClock
    },
    {
        label: "Calendar",
        to: ROUTES.ADMIN_CALENDAR,
        icon: CalendarDays
    },
    {
        label: "Notes",
        to: ROUTES.ADMIN_NOTES,
        icon: StickyNote
    },
    {
        label: "Users",
        to: ROUTES.ADMIN_USERS,
        icon: Users
    },
];

/**
 * Navigation items for student users. Fewer than BottomNav's overflow
 * threshold, so `pinned` never comes into play here — every item
 * always shows directly.
 * 
 * @type {Array<{ label: string, to: string, icon: React.ComponentType }>}
 */
export const STUDENT_NAV_ITEMS = [
    {
        label: "Dashboard",
        to: ROUTES.STUDENT_DASHBOARD,
        icon: LayoutDashboard
    },
    {
        label: "Tasks",
        to: ROUTES.STUDENT_TASKS,
        icon: ListChecks
    },
    {
        label: "Assignments",
        to: ROUTES.STUDENT_ASSIGNMENTS,
        icon: ClipboardList
    },
    {
        label: "Account",
        to: ROUTES.STUDENT_ACCOUNT,
        icon: UserCircle
    },
];