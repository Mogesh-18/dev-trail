
/**
 * Formats a date string into a human‑readable relative time (e.g., "5m ago", "2d ago").
 * Falls back to a locale‑sensitive date string for entries older than a week.
 * 
 * @param {string} dateString - An ISO‑8601 date string.
 * @returns {string} The formatted relative time.
 */
export function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const diffMin = Math.round((Date.now() - date.getTime()) / 60000);
    if (diffMin < 1) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.round(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    const diffDay = Math.round(diffHr / 24);
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString();
}