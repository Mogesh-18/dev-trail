import { TemplateRepository } from "@/repositories/template.repository";

/**
 * Sanitises an estimated minutes value to a number or null.
 * Returns `null` for empty strings, undefined, null, or invalid numbers.
 * 
 * @param {string|number|null|undefined} value - The raw input value.
 * @returns {number|null} A valid finite number, or `null`.
 */
function sanitizeEstimatedMinutes(value) {
    if (value === "" || value === undefined || value === null) return null;
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
}

/**
 * Service layer for templates, delegating to `TemplateRepository`.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   create: (input: Object) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const TemplateService = {

    /**
     * Fetches all templates.
     * 
     * @returns {Promise<Array>}
     */
    list: () => TemplateRepository.list(),

    /**
     * Creates a new template.
     * 
     * @param {Object} input - Same shape as `templatesProvider.create`.
     * @returns {Promise<Object>}
     */
    create(input) {
        const title = (input.title || "").trim();
        if (!title) {
            return Promise.reject(
                new Error("A title is required to save a template.")
            );
        }
        return TemplateRepository.create({
            ...input,
            title,
            estimatedMinutes: sanitizeEstimatedMinutes(input.estimatedMinutes),
        });
    },

    /**
     * Deletes a template by ID.
     * 
     * @param {string|number} id - Template ID.
     * @returns {Promise<void>}
     */
    remove: (id) => TemplateRepository.remove(id),
};