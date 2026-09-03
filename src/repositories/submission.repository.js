import { submissionsProvider } from "@/data-providers/supabase/submissions.provider";

/**
 * Repository wrapper for submission operations.
 * 
 * @type {{
 *   listByAssignment: (assignmentId: string|number) => Promise<Array>,
 *   create: (input: { assignmentId: string|number, url: string, note?: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const SubmissionRepository = {
    listByAssignment: (assignmentId) => submissionsProvider.listByAssignment(assignmentId),
    create: (input) => submissionsProvider.create(input),
    remove: (id) => submissionsProvider.remove(id),
};