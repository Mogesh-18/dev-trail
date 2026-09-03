import { SubmissionRepository } from "@/repositories/submission.repository";

/**
 * Detects the hosting platform from a URL (GitHub, CodeSandbox, StackBlitz, or other).
 * 
 * @param {string} url - The submission URL.
 * @returns {'github'|'codesandbox'|'stackblitz'|'other'}
 */
function detectCodeHost(url) {
    if (/codesandbox\.io/.test(url)) return "codesandbox";
    if (/github\.com/.test(url)) return "github";
    if (/stackblitz\.com/.test(url)) return "stackblitz";
    return "other";
}

/**
 * Service layer for submissions, delegating to `SubmissionRepository`.
 * Also provides the `detectCodeHost` utility.
 * 
 * @type {{
 *   listByAssignment: (assignmentId: string|number) => Promise<Array>,
 *   create: (input: { assignmentId: string|number, url: string, note?: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>,
 *   detectCodeHost: (url: string) => 'github'|'codesandbox'|'stackblitz'|'other'
 * }}
 */
export const SubmissionService = {

    /**
     * Lists submissions for an assignment.
     * 
     * @param {string|number} assignmentId
     * @returns {Promise<Array>}
     */
    listByAssignment: (assignmentId) => SubmissionRepository.listByAssignment(assignmentId),
  
    /**
     * Creates a new submission.
     * 
     * @param {Object} input - Same as `submissionsProvider.create`.
     * @returns {Promise<Object>}
     */
    create: (input) => SubmissionRepository.create(input),
  
    /**
     * Deletes a submission by ID.
     * 
     * @param {string|number} id
     * @returns {Promise<void>}
     */
    remove: (id) => SubmissionRepository.remove(id),

    /** 
     * Detects the code host of a URL. 
     */
    detectCodeHost,
};