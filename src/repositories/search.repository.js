import { searchProvider } from "@/data-providers/supabase/search.provider";

/**
 * Repository wrapper for search operations.
 * 
 * @type {{
 *   search: (query: string, limit?: number) => Promise<Object>
 * }}
 */
export const SearchRepository = {
    search: (query, limit) => searchProvider.search(query, limit),
};