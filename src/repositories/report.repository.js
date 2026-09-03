import { reportsProvider } from "@/data-providers/supabase/reports.provider";

/**
 * Repository wrapper for report operations.
 * Delegates all calls to `reportsProvider`.
 * 
 * @type {{
 *   listByTaskPage: (params: { taskId: string, cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string|null }>,
 *   create: (input: { taskId: string, title: string, body: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const ReportRepository = {
    listByTaskPage: (params) => reportsProvider.listByTaskPage(params),
    create: (input) => reportsProvider.create(input),
    remove: (id) => reportsProvider.remove(id),
};