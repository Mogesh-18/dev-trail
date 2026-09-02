import { activityProvider } from "@/data-providers/supabase/activity.provider";

export const ActivityRepository = {
    list: (limit) => activityProvider.list(limit),
    listPage: (params) => activityProvider.listPage(params),
    log: (entry) => activityProvider.log(entry),
};