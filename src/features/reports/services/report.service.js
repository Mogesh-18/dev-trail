import { ReportRepository } from "@/repositories/report.repository";
import { emit, EVENTS } from "@/app/events/bus";

export const ReportService = {
    /**
     * Paginated list of reports for a task.
     * 
     * @param {Object} params - Same as `reportsProvider.listByTaskPage`.
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    listByTaskPage: (params) => ReportRepository.listByTaskPage(params),

    /**
     * Creates a report, then emits a `REPORT_SUBMITTED` event.
     * 
     * @param {Object} params
     * @param {string} params.taskId
     * @param {string} params.title
     * @param {string} params.body
     * @returns {Promise<Object>} Created report.
     */
    async create({ taskId, title, body }) {
        const report = await ReportRepository.create({ 
            taskId, 
            title, 
            body 
        });
        emit(EVENTS.REPORT_SUBMITTED, { 
            taskId, 
            reportId: report.id 
        });
        return report;
    },

    /**
     * Deletes a report by ID.
     * @param {string|number} id - Report ID.
     * @returns {Promise<void>}
     */
    remove: (id) => ReportRepository.remove(id),
};