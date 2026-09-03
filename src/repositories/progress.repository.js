import { progressProvider } from "@/data-providers/supabase/progress.provider";

/**
 * Repository wrapper for task progress operations.
 * Delegates all calls to `progressProvider`.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   upsertStatus: (taskId: string|number, status: string) => Promise<Object>,
 *   clearStatus: (taskId: string|number) => Promise<void>
 * }}
 */
export const ProgressRepository = {
    list: () => progressProvider.list(),
    upsertStatus: (taskId, status) => progressProvider.upsertStatus(taskId, status),
    clearStatus: (taskId) => progressProvider.clearStatus(taskId),
};