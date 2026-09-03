import { SearchRepository } from "@/repositories/search.repository";

/**
 * Service layer for search, delegating to `SearchRepository`.
 * 
 * @type {{
 *   search: (query: string, limit?: number) => Promise<Object>
 * }}
 */
export const SearchService = {

    /**
     * Searches across all entities.
     * 
     * @param {string} query - The search term.
     * @param {number} [limit] - Max results per type.
     * @returns {Promise<Object>} Results grouped by entity type.
     */
    search: (query, limit) => SearchRepository.search(query, limit),
};