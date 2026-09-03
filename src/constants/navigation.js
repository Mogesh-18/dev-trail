import { LayoutDashboard, ListChecks, ClipboardList, TrendingUp, StickyNote, Users, UserCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";

/**
 * Navigation items for admin users.
 * 
 * @type {Array<{ label: string, to: string, icon: React.ComponentType }>}
 */
export const ADMIN_NAV_ITEMS = [
    { 
        label: "Dashboard", 
        to: ROUTES.ADMIN_DASHBOARD, 
        icon: LayoutDashboard 
    },
    { 
        label: "Tasks", 
        to: ROUTES.ADMIN_TASKS, 
        icon: ListChecks 
    },
    { 
        label: "Assignments", 
        to: ROUTES.ADMIN_ASSIGNMENTS, 
        icon: ClipboardList 
    },
    { 
        label: "Progress", 
        to: ROUTES.ADMIN_PROGRESS, 
        icon: TrendingUp 
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
 * Navigation items for student users.
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