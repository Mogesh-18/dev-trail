import { ActivityRepository } from "@/repositories/activity.repository";

/**
 * Service layer for activity operations, delegating to `ActivityRepository`.
 * 
 * @type {{
 *   list: (limit?: number) => Promise<Array>,
 *   listPage: (params: { cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string|null }>,
 *   log: (entry: { type: string, entityType: string, entityId: string|number, metadata?: Object }) => Promise<void>
 * }}
 */
export const ActivityService = {
    
    /**
     * Fetches the most recent activity entries.
     * 
     * @param {number} [limit] - Max number of entries (default from repository).
     * @returns {Promise<Array>} List of activities (newest first).
     */
    list: (limit) => ActivityRepository.list(limit),

    /**
     * Paginated list of activities (newest first).
     * 
     * @param {Object} params
     * @param {string} [params.cursor] - `created_at` cursor.
     * @param {number} [params.pageSize=10]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    listPage: (params) => ActivityRepository.listPage(params),

    /**
     * Logs a new activity event.
     * 
     * @param {Object} entry
     * @param {string} entry.type - Event type (from `EVENTS`).
     * @param {string} entry.entityType - e.g., "task", "assignment".
     * @param {string|number} entry.entityId
     * @param {Object} [entry.metadata]
     * @returns {Promise<void>}
     */
    log: (entry) => ActivityRepository.log(entry),
};