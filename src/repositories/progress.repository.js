import { progressProvider } from "@/data-providers/supabase/progress.provider";

export const ProgressRepository = {
    list: () => progressProvider.list(),
    upsertStatus: (taskId, status) => progressProvider.upsertStatus(taskId, status),
    clearStatus: (taskId) => progressProvider.clearStatus(taskId),
};