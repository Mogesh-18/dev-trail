import { useState, useEffect } from "react";
import { SearchService } from "@/features/search/services/search.service";

/**
 * Minimum characters required to trigger a search.
 * 
 * @type {number}
 */
const MIN_QUERY_LENGTH = 3;

/**
 * Debounce delay (ms) for search input to avoid excessive requests.
 * 
 * @type {number}
 */
const DEBOUNCE_MS = 250;

/**
 * Hook that performs a debounced global search when the query reaches 3 characters.
 * 
 * @param {string} query - The search query.
 * @returns {{ results: Object|null, isLoading: boolean }}
 */
export function useGlobalSearch(query) {
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.trim().length < MIN_QUERY_LENGTH) {
            setResults(null);
            setIsLoading(false);
            return undefined;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            const data = await SearchService.search(query.trim());
            setResults(data);
            setIsLoading(false);
        }, DEBOUNCE_MS);

        return () => clearTimeout(timer);
    }, [query]);

    return { 
        results, 
        isLoading 
    };
}