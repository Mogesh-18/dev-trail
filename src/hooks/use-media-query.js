import { useEffect, useState } from "react";

/**
 * React hook that tracks whether a media query matches.
 * 
 * @param {string} query - A CSS media query string (e.g., `"(min-width: 768px)"`).
 * @returns {boolean} `true` if the query matches, `false` otherwise.
 */
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(() =>
        typeof window !== "undefined" ? window.matchMedia(query).matches : false
    );

    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        listener();
        media.addEventListener("change", listener);
        return () => media.removeEventListener("change", listener);
    }, [query]);

    return matches;
}