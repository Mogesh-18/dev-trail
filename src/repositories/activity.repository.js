import { activityProvider } from "@/data-providers/supabase/activity.provider";

export const ActivityRepository = {
    list: (limit) => activityProvider.list(limit),
    log: (entry) => activityProvider.log(entry),
};