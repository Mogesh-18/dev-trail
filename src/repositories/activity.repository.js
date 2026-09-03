import { activityProvider } from "@/data-providers/supabase/activity.provider";

/**
 * Repository wrapper for activity-related data operations.
 * Delegates all calls to `activityProvider`.
 * 
 * @type {{
 *   list: (limit?: number) => Promise<Array>,
 *   listPage: (params: { cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string | null }>,
 *   log: (entry: { type: string, entityType: string, entityId: string|number, metadata?: Object }) => Promise<void>
 * }}
 */
export const ActivityRepository = {
    list: (limit) => activityProvider.list(limit),
    listPage: (params) => activityProvider.listPage(params),
    log: (entry) => activityProvider.log(entry),
};